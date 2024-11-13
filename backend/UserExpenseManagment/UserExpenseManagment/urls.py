"""UserExpenseManagment URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from userManagment import views

# username: admin
# email: admin@gmail.com
# password: Admin78@123

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login',views.login,name='login'),
    path('signUP',views.sign_up, name='signUP'),
    path('',views.home, name='home'),
    # path('addExpense', views.addExpense, name='addExpense'),
    # path('retriveExpense', views.retriveExpense, name='retriveExpense'),
    path('editUser', views.editUser, name='editUser'),
    path('deleteUser', views.deleteUser, name='deleteUser'),
    path('addAdminUser', views.addAdminuser, name='addAdminuser'),
    path('getusers', views.getusers, name='getusers'),
    path('finduser', views.findUser, name='findUser'),
    path('findUserCount', views.findUserCount, name='ReportUser'),
    path('findUser_id', views.findUser_id, name="findUser_id"),
    path('findUser_by_name', views.findUser_by_name, name='findUser_by_name'),
    path('health_check', views.health_check, name='health_check')
    
    # path('userReport', views.userReport, name='userReport'),
    # path('adminReport', views.adminReport, name='adminReport'),
    # path('adminFilterReport', views.adminFilterReport , name='adminFilterReport'),
    # path('userFilterReport', views.userFilteredReport , name='userFilterReport')
    # path('add')

    
    # path('send-otp/', views.send_otp, name='send_otp'),
    # path('verify-otp/', views.verify_otp, name='verify_otp'),

]
