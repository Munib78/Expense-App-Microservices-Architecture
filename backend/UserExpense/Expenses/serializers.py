from rest_framework import serializers
from .models import *

class ExpensesModel(serializers.ModelSerializer):
     class Meta:
          model = Expense
          fields = ['name', 'amount', 'date', 'location', 'userid']
