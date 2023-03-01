# Generated by Django 4.1.5 on 2023-02-28 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nyuapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('q_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('difficulty', models.CharField(blank=True, max_length=10)),
                ('type', models.CharField(blank=True, max_length=50)),
                ('companies', models.CharField(blank=True, max_length=500, verbose_name='Comma-separated list of companies')),
                ('positions', models.CharField(blank=True, max_length=500, verbose_name='Comma-separated list of positions')),
                ('categories', models.CharField(blank=True, max_length=500, verbose_name='Comma-separated list of categories')),
            ],
        ),
    ]