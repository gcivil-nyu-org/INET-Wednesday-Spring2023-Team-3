from django.db import models
from questions.models import Question


class DropBox(models.Model):
    ans_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    file = models.FileField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Drop Boxes"


class Comment(models.Model):
    comment_id = models.BigAutoField(primary_key=True)
    answer = models.ForeignKey(DropBox, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(rating__gte=1) & models.Q(rating__lte=10),
                name="A rating value is valid between 1 and 10",
            )
        ]
