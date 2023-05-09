from django.db import models
from django.core.validators import RegexValidator


class StudentAlumniProfile(models.Model):
    email = models.EmailField(max_length=255, unique=True, default="")
    job_preference = models.CharField(max_length=100, null=True, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    previous_employer = models.CharField(max_length=100, null=True, blank=True)
    linkedin_link = models.URLField(
        validators=[RegexValidator(r"^https://www.linkedin.com/in/*")],
        null=True,
        blank=True,
    )
    github_link = models.URLField(
        validators=[RegexValidator(r"^https://github.com/*")], null=True, blank=True
    )
    img_file = models.FileField(max_length=300, null=True, blank=True)
    user_summary = models.TextField(null=True, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    highest_degree = models.CharField(max_length=50, default="", null=True, blank=True)
    degree_subject = models.CharField(max_length=50, default="", null=True, blank=True)


class CompanyProfile(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=100)
    website = models.URLField(max_length=200)
    description = models.TextField()
    img_file = models.FileField(max_length=200, null=True, blank=True)
    company_logo = models.FileField(max_length=300, null=True, blank=True)
