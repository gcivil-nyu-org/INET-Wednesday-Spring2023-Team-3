# Generated by Django 3.2 on 2023-03-18 17:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("questions", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="question",
            name="title",
            field=models.CharField(max_length=300),
        ),
    ]
