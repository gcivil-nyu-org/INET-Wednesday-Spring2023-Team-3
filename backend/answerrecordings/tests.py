from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from django.test import Client
from rest_framework import status
from .models import DropBox, Comment
from onboarding.models import MyUser
from questions.models import Question
import json


class CommentTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = MyUser.objects.create_user(
            email="user1@test.com",
            password="testpass123",
            first_name="John",
            last_name="Doe",
        )
        self.user2 = MyUser.objects.create_user(
            email="user2@test.com",
            password="testpass123",
            first_name="Jane",
            last_name="Doe",
        )

        self.question1 = Question.objects.create(
            title="Test question 1",
            description="This is a test question.",
            difficulty="easy",
            type="multiple choice",
            companies="Acme Inc.",
        )

        self.dropbox1 = DropBox.objects.create(
            user=self.user1,
            question=self.question1,
            title="Test dropbox 1",
            file="path/to/test/file.pdf",
        )

        self.comment1 = Comment.objects.create(
            user=self.user1,
            answer=self.dropbox1,
            text="Test comment 1",
            rating=7,
        )
        self.comment2 = Comment.objects.create(
            user=self.user2,
            answer=self.dropbox1,
            text="Test comment 2",
            rating=8,
        )

    def test_get_comments(self):
        url = reverse("get_comments", kwargs={"answer_id": self.dropbox1.ans_id})
        response = self.client.get(url)
        response = json.loads(response.content)
        print(response)
        self.assertEqual(response["status_code"], status.HTTP_200_OK)
        self.assertEqual(len(response["comment_data"]), 2)
        self.assertEqual(
            response["comment_data"][0]["fields"]["text"], "Test comment 1"
        )
        self.assertEqual(
            response["comment_data"][1]["fields"]["text"], "Test comment 2"
        )
        self.assertEqual(response["comment_data"][0]["fields"]["username"], "John Doe")
        self.assertEqual(response["comment_data"][1]["fields"]["username"], "Jane Doe")

    def test_get_comments_invalid_id(self):
        url = reverse("get_comments", kwargs={"answer_id": 999})
        response = self.client.get(url)
        response = json.loads(response.content)
        print(response)
        self.assertEqual(response["status_code"], status.HTTP_200_OK)
        self.assertEqual(response["error_msg"], "")
        self.assertEqual(len(response["comment_data"]), 0)


class ModelTestCase(TestCase):
    def setUp(self):
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="testpassword",
            first_name="John",
            last_name="Doe",
            date_of_birth="2000-01-01",
        )
        self.question = Question.objects.create(
            title="Question Title",
            description="Question Description",
            difficulty="Easy",
            type="Multiple Choice",
        )
        self.dropbox = DropBox.objects.create(
            user=self.user,
            question=self.question,
            title="DropBox Title",
            file="test_file.txt",
        )
        self.comment = Comment.objects.create(
            user=self.user,
            answer=self.dropbox,
            text="Comment Text",
            rating=5,
        )

    def test_question_creation(self):
        question = Question.objects.get(title="Question Title")
        self.assertEqual(question.title, "Question Title")
        self.assertEqual(question.description, "Question Description")
        self.assertEqual(question.difficulty, "Easy")
        self.assertEqual(question.type, "Multiple Choice")

    def test_dropbox_creation(self):
        dropbox = DropBox.objects.get(question=self.question)
        self.assertEqual(dropbox.user, self.user)
        self.assertEqual(dropbox.question, self.question)
        self.assertEqual(dropbox.title, "DropBox Title")
        self.assertEqual(dropbox.file, "test_file.txt")

    def test_comment_creation(self):
        comment = Comment.objects.get(answer=self.dropbox)
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.answer, self.dropbox)
        self.assertEqual(comment.text, "Comment Text")
        self.assertEqual(comment.rating, 5)


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="testpassword",
            first_name="John",
            last_name="Doe",
            date_of_birth="2000-01-01",
        )
        self.question = Question.objects.create(
            title="Question Title",
            description="Question Description",
            difficulty="Easy",
            type="Multiple Choice",
        )
        self.dropbox = DropBox.objects.create(
            user=self.user,
            question=self.question,
            title="DropBox Title",
            file="test_file.txt",
        )
        self.comment_data = {
            "user": self.user.id,
            "answer": self.dropbox.ans_id,
            "text": "Test Comment Text",
            "rating": 7,
        }

    def test_post_comment_view(self):
        self.client.login(username="test@example.com", password="testpassword")
        response = self.client.post(
            reverse("post_comment"),
            json.dumps(self.comment_data),
            content_type="application/json",
        )
        response = json.loads(response.content)
        print(response)
        self.assertEqual(response["status"], status.HTTP_200_OK)
        self.assertEqual(
            response["inserted_comment"][0]["fields"]["text"],
            "Test Comment Text",
        )

    def test_post_comment_view_invalid_method(self):
        self.client.login(username="test@example.com", password="testpassword")
        response = self.client.get(reverse("post_comment"))
        response = json.loads(response.content)
        print(response)
        self.assertEqual(response["status"], 400)
