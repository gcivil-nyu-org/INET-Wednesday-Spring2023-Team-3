# Generated by Django 3.2 on 2023-03-28 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('onboarding', '0002_myuser_usertype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='userType',
            field=models.CharField(choices=[('Student/Alumni', 'Student/Alumni'), ('Recruiter', 'Recruiter')], max_length=100),
        ),
    ]