from django.db import models

class Expense(models.Model):
    userid = models.IntegerField()
    name = models.CharField(max_length=30)

    amount = models.IntegerField()

    date = models.DateField()

    location = models.CharField(max_length=60)

