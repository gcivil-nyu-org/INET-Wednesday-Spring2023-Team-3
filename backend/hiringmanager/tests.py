from django.test import TestCase
from django.urls import reverse

# from django.contrib.auth import get_user_model
from .models import Aggregations, UserWiseAggregation
from experiences.models import Experience, ExperienceComment
from codinganswers.models import QuestionSubmissionCode
from answerrecordings.models import DropBox, Comment
from onboarding.models import MyUser
from questions.models import Question
import json
from rest_framework import status


class HiringManagerUserMetadataTestCase(TestCase):
    def setUp(self):
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="testpassword",
            first_name="John",
            last_name="Doe",
            date_of_birth="1990-01-01",
        )
        self.experience = Experience.objects.create(
            user=self.user, exp_title="Test Experience", exp_text="Test content"
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
        self.question_submission_code = QuestionSubmissionCode.objects.create(
            question=self.question,
            user=self.user,
            sub_text="test submission code",
            language="python",
        )
        self.exp_comment = ExperienceComment.objects.create(
            user=self.user,
            experience=self.experience,
            text="Test comment 1",
        )
        self.comment = Comment.objects.create(
            user=self.user,
            answer=self.dropbox,
            text="Comment Text",
            rating=5,
        )
        self.aggregation = Aggregations.objects.create(last_agg_id=0)

    def test_refresh_user_metadata(self):
        url = reverse("refresh_user_metadata")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # Check if UserWiseAggregation is created for all users
        all_users = MyUser.objects.all()
        last_agg_id = Aggregations.objects.all().first().last_agg_id
        for user in all_users:
            agg = UserWiseAggregation.objects.get(user=user, agg_id=last_agg_id)
            self.assertEqual(agg.num_exp_posted, 1)
            self.assertEqual(agg.num_rec_posted, 1)
            self.assertEqual(agg.num_codes_posted, 1)
            self.assertEqual(agg.num_totalcmnts_posted, 2)
            self.assertEqual(agg.num_expcmnts_posted, 1)
            self.assertEqual(agg.num_anscmnts_posted, 1)
            self.assertEqual(agg.avg_rec_rating_received, 5)

    def test_fetch_latest_aggregated_user_data(self):
        self.test_refresh_user_metadata()
        url = reverse("fetch_latest_aggregated_user_data")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        response = json.loads(response.content)
        self.assertEqual(response["status"], status.HTTP_200_OK)
        self.assertEqual(response["error_msg"], "")
        self.assertEqual(response["total_user_count"], 1)
        self.assertEqual(len(response["user_data"]), 1)
        self.assertEqual(response["user_data"][0]["fields"]["username"], "John Doe")
        self.assertEqual(response["user_data"][0]["fields"]["user"], self.user.id)
