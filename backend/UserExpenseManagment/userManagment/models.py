from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
import secrets
# Create your models here.

class User(models.Model):
    ROLE_CHOICES = [
        ('User', 'User'),
        ('Admin', 'Admin')
    ]
    name = models.CharField(max_length=50)

    email_add = models.EmailField(unique=True)

    mobile_no = models.CharField(max_length=10)

    password = models.CharField(max_length=150)

    user_name = models.CharField(max_length=30)

    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default='User')

    def gen_otp(self):
        self.otp = secrets.token_hex(3)
        self.save() 

# class Expenses(models.Model):
#     userid = models.ForeignKey(User, on_delete= models.CASCADE, default=0)
#     name = models.CharField(max_length=30)

#     amount = models.IntegerField()

#     date = models.DateField()

#     # bill = models.FileField(upload_to='user_bills')

#     location = models.CharField(max_length=60)

