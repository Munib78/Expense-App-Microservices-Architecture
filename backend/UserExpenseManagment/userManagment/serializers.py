from django import forms 
from rest_framework import serializers
from .models import *

class UserModel(serializers.ModelSerializer):
    class Meta:
         model = User
         fields = ['name', 'password', 'mobile_no', 'email_add', 'user_name', 'role']


# class ExpensesModel(serializers.ModelSerializer):
#      class Meta:
#           model = Expenses
#           fields = ['name', 'amount', 'date', 'location', 'userid']
