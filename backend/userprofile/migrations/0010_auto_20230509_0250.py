# Generated by Django 3.2 on 2023-05-09 02:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userprofile", "0009_auto_20230509_0048"),
    ]

    operations = [
        migrations.AlterField(
            model_name="companyprofile",
            name="description",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="companyprofile",
            name="website",
            field=models.URLField(blank=True, null=True),
        ),
    ]
