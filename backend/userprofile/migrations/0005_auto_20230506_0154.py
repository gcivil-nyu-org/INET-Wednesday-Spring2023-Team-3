# Generated by Django 3.2 on 2023-05-06 01:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("userprofile", "0004_auto_20230429_2304"),
    ]

    operations = [
        migrations.AddField(
            model_name="companyprofile",
            name="company_logo",
            field=models.FileField(blank=True, max_length=300, null=True, upload_to=""),
        ),
        migrations.AddField(
            model_name="studentalumniprofile",
            name="gpa",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=4, null=True
            ),
        ),
        migrations.AddField(
            model_name="studentalumniprofile",
            name="highest_degree",
            field=models.CharField(blank=True, default="", max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="studentalumniprofile",
            name="user_summary",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="studentalumniprofile",
            name="img_file",
            field=models.FileField(blank=True, max_length=300, null=True, upload_to=""),
        ),
    ]