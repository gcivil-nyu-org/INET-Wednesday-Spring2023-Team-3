# Generated by Django 4.1.5 on 2023-03-08 00:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("nyuapp", "0003_company_difficulty"),
    ]

    operations = [
        migrations.CreateModel(
            name="Position",
            fields=[
                (
                    "name",
                    models.CharField(max_length=50, primary_key=True, serialize=False),
                ),
            ],
        ),
    ]
