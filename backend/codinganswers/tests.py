from django.test import TestCase, Client
from django.urls import reverse
from .models import QuestionStarterCode, QuestionSubmissionCode
from onboarding.models import MyUser
from questions.models import Question
import json


class GetStarterCodeTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('get_starter_code')

        self.user = MyUser.objects.create_user(
            email='testuser@example.com',
            password='testpass123',
        )

        self.question = Question.objects.create(
            title='Test Question',
            description='Test Question Description',
            difficulty='easy',
            type='test_type',
            companies='company1, company2',
            positions='position1, position2',
            categories='category1, category2',
        )

        self.question_starter_code = QuestionStarterCode.objects.create(
            question=self.question,
            language='python',
            sc_text='starter code for test question',
        )

        self.question_submission_code = QuestionSubmissionCode.objects.create(
            question=self.question,
            user=self.user,
            sub_text='test submission code',
            language='python',
        )

    def test_get_starter_code_success(self):
        params = {
            'user': self.user.id,
            'language': 'python',
            'question': self.question.q_id,
        }
        response = self.client.get(self.url, params)
        response = json.loads(response.content)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response['starter_code'], 'test submission code')

    def test_get_starter_code_no_question(self):
        params = {
            'user': self.user.id,
            'language': 'python',
            'question': '',
        }
        response = self.client.get(self.url, params)
        response = json.loads(response.content)
        self.assertEqual(response["status"], 400)
        self.assertEqual(response['error_msg'], 'Error: Question not entered!')

    def test_get_starter_code_unable_to_parse_question_id(self):
        params = {
            'user': self.user.id,
            'language': 'python',
            'question': 'invalid_id',
        }
        response = self.client.get(self.url, params)
        response = json.loads(response.content)
        self.assertEqual(response["status"], 400)
        self.assertIn('Error: Unable to parse question_id!', response['error_msg'])

    def test_get_starter_code_user_and_language_missing(self):
        params = {
            'user': '',
            'language': '',
            'question': self.question.q_id,
        }
        response = self.client.get(self.url, params)
        response = json.loads(response.content)
        self.assertEqual(response["status"], 400)
        self.assertIn('Error: Enter user and language fields!', response['error_msg'])

    def test_get_starter_code_question_not_found(self):
        params = {
            'user': self.user.id,
            'language': 'python',
            'question': 999,
        }
        response = self.client.get(self.url, params)
        response = json.loads(response.content)
        self.assertEqual(response["status"], 400)
        self.assertIn('Error: Something went wrong!: QuestionStarterCode matching query does not exist.', response['error_msg'])

    def test_get_starter_code_user_submission_not_found(self):
        self.question_submission_code.delete()
        params = {
            'user': self.user.id,
            'language': 'python',
            'question': self.question.q_id,
        }
        response = self.client.get(self.url, params)
        response = json.loads(response.content)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response['starter_code'], 'starter code for test question')
