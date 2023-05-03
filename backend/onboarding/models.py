from django.db import models
from authemail.models import EmailUserManager, EmailAbstractUser


# Create your models here.
class MyUser(EmailAbstractUser):
    # Custom fields
    date_of_birth = models.DateField("Date of birth", null=True, blank=True)

    # Required
    objects = EmailUserManager()

    friends = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return f"{self.first_name}, {self.last_name}"
