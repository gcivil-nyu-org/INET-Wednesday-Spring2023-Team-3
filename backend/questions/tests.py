from django.test import TestCase
from .models import Question, Difficulty, Company, Position
from django.test import Client
from django.urls import reverse
import json

class QuestionsModelTest(TestCase):
    def test_question_creation_success(self):
        title, description, companies, categories, difficulty, positions, type = "t1", "desc1", "c1,c2", "cat1,cat2", "d1,d2", "p1,p2", "t1,t2"
        question = Question.objects.create(title=title,
            description=description,
            companies=companies,
            categories=categories,
            difficulty=difficulty,
            positions=positions,
            type=type,)
        
        self.assertEqual(question.title, title)
        self.assertEqual(question.description, description)
        self.assertEqual(question.companies, companies)
        self.assertEqual(question.categories, categories)
        self.assertEqual(question.difficulty, difficulty)
        self.assertEqual(question.positions, positions)
        self.assertEqual(question.type, type)

        self.assertEqual(question.__str__(),f"{question.q_id} : {type} , {title} , {difficulty}")

    def test_difficulty_creation_success(self):
        new_difficulty = "diff1"
        diff_new = Difficulty.objects.create(text=new_difficulty)

        self.assertEqual(diff_new.text, new_difficulty)
    
    def test_company_creation_success(self):
        new_company = "com1"
        com_new = Company.objects.create(name=new_company)

        self.assertEqual(com_new.name, new_company)
    
    def test_position_creation_success(self):
        new_position = "pos1"
        pos_new = Position.objects.create(name=new_position)

        self.assertEqual(pos_new.name, new_position)

class QuestionViewTest(TestCase):
    def setUp(self) -> None:
        super().setUp()
        self.client = Client()
    
    def get_sample_success_request_body(self):
        req_body = {
            'title': 'test_title',
            'description': 'test_desc',
            'companies': 'test_comp1,test_comp2',
            'positions': 'p1,p2',
            'difficulty': 'd1',
            'type': 't1',
            'categories': 'c1'
        }
        return req_body

    def test_post_question_success(self):
        req_body = self.get_sample_success_request_body()
        response = self.client.post(reverse("post_question"), data = req_body, content_type='application/json')
        self.assertIsNotNone(response)

        response_dict = json.loads(response.content)
        self.assertIsNotNone(response_dict)

        response_params = ["status", "error_msg", "inserted_question"]
        self.assertTrue(all([param in response_dict for param in response_params]))

        param_vals = [response_dict[param] for param in response_params]
        self.assertEqual(200, param_vals[0])
        self.assertEqual("", param_vals[1])

        inserted_question = param_vals[2]
        self.assertEqual(1, len(inserted_question))

        question = inserted_question[0]
        self.assertEqual("questions.question", question["model"])
        self.assertEqual(req_body, question["fields"])

        for c in req_body["companies"].split(','):
            self.assertEqual(1, Company.objects.filter(name=c).count())
        for p in req_body["positions"].split(','):
            self.assertEqual(1, Position.objects.filter(name=p).count())
        self.assertEqual(1, Difficulty.objects.filter(text=req_body["difficulty"]).count())
    
    def test_post_question_failure_jsondecodingerror(self):
        response = self.client.post(reverse("post_question"), data = {})
        self.assertIsNotNone(response)
        response_dict = json.loads(response.content)
        self.assertIsNotNone(response_dict)

        response_params = ["status", "error_msg"]
        self.assertTrue(all([param in response_dict for param in response_params]))

        param_vals = [response_dict[param] for param in response_params]
        self.assertEqual(400, param_vals[0])
        self.assertTrue("JSONDecodeError" in str(param_vals[1]))

    def test_post_question_failure_missingparam(self):
        response = self.client.post(reverse("post_question"), data = {}, content_type='application/json')
        self.assertIsNotNone(response)
        response_dict = json.loads(response.content)
        self.assertIsNotNone(response_dict)

        response_params = ["status", "error_msg"]
        self.assertTrue(all([param in response_dict for param in response_params]))

        param_vals = [response_dict[param] for param in response_params]
        self.assertEqual(400, param_vals[0])
        self.assertTrue("Key not passed" in str(param_vals[1]))

    def test_post_question_failure_invalidmethod(self):
        response = self.client.get(reverse("post_question"))
        self.assertIsNotNone(response)
        response_dict = json.loads(response.content)
        self.assertIsNotNone(response_dict)

        response_params = ["status", "error_msg"]
        self.assertTrue(all([param in response_dict for param in response_params]))

        param_vals = [response_dict[param] for param in response_params]
        self.assertEqual(400, param_vals[0])
        self.assertTrue("Invalid HTTP method" in str(param_vals[1]))

    def test_get_question_success_plain(self):
        self.test_post_question_success()
        response = self.client.get(reverse("get_questions"))
        self.assertIsNotNone(response)
        response_dict = json.loads(response.content)
        self.assertIsNotNone(response_dict)

        response_params = ["status", 
                           "total_question_count", 
                           "difficulties", 
                           "companies", 
                           "positions", 
                           "error_msg",
                           "question_data"]
        self.assertTrue(all([param in response_dict for param in response_params]))
        param_vals = [response_dict[param] for param in response_params]

        self.assertEqual(200, param_vals[0])
        self.assertEqual(1, param_vals[1])
        self.assertEqual(1, len(param_vals[2]))
       
        sample_question = self.get_sample_success_request_body()
        self.assertEqual(len(param_vals[3]), len(sample_question["companies"].split(',')))
        self.assertEqual(len(param_vals[4]), len(sample_question["positions"].split(',')))
        self.assertEqual("", param_vals[5])

        question = param_vals[6]
        self.assertEqual(1, len(question))
        question = question[0]
        self.assertEqual("questions.question", question["model"])
        self.assertEqual(sample_question, question["fields"])


        