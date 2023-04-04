# Generated by Django 3.2 on 2023-04-04 00:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("answerrecordings", "0004_alter_comment_rating"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="rating",
            field=models.IntegerField(),
        ),
        migrations.AddConstraint(
            model_name="comment",
            constraint=models.CheckConstraint(
                check=models.Q(("rating__gte", 1), ("rating__lt", 10)),
                name="A rating value is valid between 1 and 10",
            ),
        ),
    ]
