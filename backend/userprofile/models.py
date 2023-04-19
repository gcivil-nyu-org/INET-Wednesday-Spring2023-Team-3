from django.db import models


class StudentAlumniProfile(models.Model):
    email = models.EmailField(max_length=255, unique=True, default="")
    job_preference = models.CharField(max_length=100)
    years_of_experience = models.IntegerField()
    previous_employer = models.CharField(max_length=100)
    linkedin_link = models.URLField()
    github_link = models.URLField()


class CompanyProfile(models.Model):
    email = models.EmailField(max_length=255, unique=True, default="")
    name = models.CharField(max_length=100)
    website = models.URLField(max_length=200)
    description = models.TextField()
