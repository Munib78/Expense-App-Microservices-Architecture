# Generated by Django 5.1.2 on 2024-11-06 18:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userManagment', '0005_user_role'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Expenses',
        ),
    ]