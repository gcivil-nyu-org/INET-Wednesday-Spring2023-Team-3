# Generated by Django 3.2 on 2023-04-10 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userprofile", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="studentalumniprofile",
            name="email",
            field=models.EmailField(default="", max_length=255, unique=True),
        ),
    ]
