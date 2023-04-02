from django.db import models
from questions.models import Question

# Create your models here.


class DropBox(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    ans_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=30)
    file = models.FileField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Drop Boxes"
