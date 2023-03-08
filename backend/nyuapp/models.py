from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title

class Question(models.Model):
    q_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1000, blank = True)
    difficulty = models.CharField(max_length=10, blank= True)
    type = models.CharField(max_length=50, blank= True)
    companies = models.CharField(verbose_name="Comma-separated list of companies", max_length=500, blank= True)
    positions = models.CharField(verbose_name="Comma-separated list of positions", max_length=500, blank= True)
    categories = models.CharField(verbose_name="Comma-separated list of categories",max_length=500, blank= True)

    def __str__(self):
        return f"{self.q_id} : {self.type} , {self.title} , {self.difficulty}"

class Difficulty(models.Model):
    text = models.CharField(max_length=10,primary_key=True)

class Company(models.Model):
    name = models.CharField(max_length=30, primary_key=True)



    