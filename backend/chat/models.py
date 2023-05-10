from django.db import models
from onboarding.models import MyUser


class Message(models.Model):
    author = models.ForeignKey(
        MyUser, related_name="author_messages", on_delete=models.CASCADE
    )
    recipient = models.ForeignKey(
        MyUser, related_name="recipient_messages", on_delete=models.CASCADE
    )
    content = models.TextField()
    timeStamp = models.DateTimeField(auto_now_add=True)
