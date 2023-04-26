from django.db import models
from onboarding.models import MyUser


class Experience(models.Model):
    exp_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    exp_title = models.CharField(max_length=50)
    exp_text = models.CharField(max_length=10000)
    img_file = models.FileField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{str(self.exp_title)},{str(self.exp_text)}"


class ExperienceComment(models.Model):
    comment_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{str(self.text)}"
