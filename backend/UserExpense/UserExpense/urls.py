"""
URL configuration for UserExpense project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from Expenses import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('addExpense', views.addExpense, name='addExpense'),
    path('retriveExpense', views.retriveExpense, name='retriveExpense'),
    path('editExpense', views.editExpense, name="editExpense"),
    path('deleteExpense', views.deleteExpense, name='deleteExpense'),
    path('adminReportExpense', views.adminReportExpense, name='adminReportExpense'),
    path('userReportExpense', views.userReportExpense, name='userReportExpense'),
    path('adminFilterReport', views.adminFilterReport , name='adminFilterReport'),
    path('userFilterReport', views.userFilteredReport , name='userFilterReport'),
    path('health_check', views.health_check, name='health_check'),
    path('admin_graph_expense', views.admin_graph_expense, name='admin_graph_expense'),
    path('user_graph_expense', views.user_graph_expense, name='user_graph_expense')
    
]
