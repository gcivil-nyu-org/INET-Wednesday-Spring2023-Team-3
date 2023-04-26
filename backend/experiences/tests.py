from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import MyUser, Experience, ExperienceComment
import json
from rest_framework.test import APIRequestFactory
from .serializers import ExperienceSerializer
from .views import ExperienceViewset
from rest_framework.test import APITestCase


class ExperienceModelTestCase(TestCase):
    def setUp(self):
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="testpassword",
            first_name="John",
            last_name="Doe",
            date_of_birth="1990-01-01",
        )
        self.experience = Experience.objects.create(
            user=self.user,
            exp_title="Test Experience",
            exp_text="This is a test experience.",
        )

    def test_create_experience(self):
        self.assertEqual(self.experience.user, self.user)
        self.assertEqual(self.experience.exp_title, "Test Experience")
        self.assertEqual(self.experience.exp_text, "This is a test experience.")
        self.assertEqual(
            str(self.experience), "Test Experience,This is a test experience."
        )


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

        self.experience = Experience.objects.create(
            user=self.user1,
            exp_title="Test Experience",
            exp_text="This is a test experience.",
        )

        self.comment1 = ExperienceComment.objects.create(
            user=self.user1,
            experience=self.experience,
            text="Test comment 1",
        )
        self.comment2 = ExperienceComment.objects.create(
            user=self.user2,
            experience=self.experience,
            text="Test comment 2",
        )

    def test_get_comments(self):
        url = reverse(
            "get_experience_comments", kwargs={"exp_id": self.experience.exp_id}
        )
        response = self.client.get(url)
        response = json.loads(response.content)
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
        url = reverse("get_experience_comments", kwargs={"exp_id": 9999})
        response = self.client.get(url)
        response = json.loads(response.content)
        self.assertEqual(response["status_code"], status.HTTP_200_OK)
        self.assertEqual(response["error_msg"], "")
        self.assertEqual(len(response["comment_data"]), 0)


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
        self.experience = Experience.objects.create(
            user=self.user,
            exp_title="Test Experience",
            exp_text="This is a test experience.",
        )

        self.comment_data = {
            "user": self.user.id,
            "experience": self.experience.exp_id,
            "text": "Test Comment Text",
        }

    def test_post_comment_view(self):
        self.client.login(username="test@example.com", password="testpassword")
        response = self.client.post(
            reverse("post_experience_comment"),
            json.dumps(self.comment_data),
            content_type="application/json",
        )
        response = json.loads(response.content)
        self.assertEqual(response["status"], status.HTTP_200_OK)
        self.assertEqual(
            response["inserted_comment"][0]["fields"]["text"],
            "Test Comment Text",
        )

    def test_post_comment_view_invalid_method(self):
        self.client.login(username="test@example.com", password="testpassword")
        response = self.client.get(reverse("post_experience_comment"))
        response = json.loads(response.content)
        self.assertEqual(response["status"], 400)


class ListExperiencesTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse("list_experiences")

        # create a user
        self.user = MyUser.objects.create(
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            date_of_birth="1990-01-01",
            is_verified=True,
        )

        # create some experiences
        self.exp1 = Experience.objects.create(
            user=self.user, exp_title="Experience 1", exp_text="This is experience 1"
        )
        self.exp2 = Experience.objects.create(
            user=self.user, exp_title="Experience 2", exp_text="This is experience 2"
        )

    def test_list_experiences_no_params(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["experience_data"]), 2)
        self.assertEqual(
            response.json()["experience_data"][0]["fields"]["username"], "John Doe"
        )

    def test_list_experiences_with_title(self):
        response = self.client.get(self.url + "?title=1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["experience_data"]), 1)
        self.assertEqual(
            response.json()["experience_data"][0]["fields"]["exp_title"], "Experience 1"
        )

    def test_list_experiences_pagination(self):
        response = self.client.get(self.url + "?cur_page=1&single_page_count=1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["experience_data"]), 1)
        self.assertEqual(
            response.json()["experience_data"][0]["fields"]["exp_title"], "Experience 1"
        )


class ExperienceViewsetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ExperienceViewset.as_view({"get": "list"})
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="test_password",
        )
        self.experience = Experience.objects.create(
            user=self.user,
            exp_title="Test experience",
            exp_text="This is a test experience",
        )

    def test_list(self):
        request = self.factory.get("/experiences/")
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            ExperienceSerializer([self.experience], many=True).data,
        )


class ExperienceCreateTestCase(APITestCase):
    def setUp(self):
        # Create a user for authentication
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="password123",
            first_name="John",
            last_name="Doe",
        )

        # Set up the request data
        self.request_data = {
            "user": self.user.id,
            "exp_title": "Test experience",
            "exp_text": "This is a test experience",
        }

    def test_create_experience(self):
        # Authenticate the user
        self.client.force_authenticate(user=self.user)

        # Send the POST request to create the experience
        response = self.client.post(
            "/experiences/post_experience/", self.request_data, format="multipart"
        )

        # Assert that the response status code is 201 CREATED
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert that the experience was created in the database
        experience = Experience.objects.first()
        self.assertIsNotNone(experience)

        # Assert that the experience data in the response matches the data in the database
        serializer = ExperienceSerializer(experience)
        self.assertEqual(response.data, serializer.data)
