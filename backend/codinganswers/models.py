from django.db import models
from questions.models import Question
from onboarding.models import MyUser


class QuestionStarterCode(models.Model):
    sc_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    language = models.TextField("Programming language", max_length=30)
    sc_text = models.TextField("Starter Code for the Question", max_length=10000)


class QuestionSubmissionCode(models.Model):
    sub_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    sub_text = models.TextField("Submitted Code for the Question", max_length=10000)
    language = models.TextField("Programming language", max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
