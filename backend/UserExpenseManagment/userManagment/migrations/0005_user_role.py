# Generated by Django 5.1.2 on 2024-10-25 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userManagment', '0004_expenses_userid'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('User', 'User'), ('Admin', 'Admin')], default='User', max_length=5),
        ),
    ]
