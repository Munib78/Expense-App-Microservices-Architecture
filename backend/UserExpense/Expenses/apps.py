# expenses/apps.py
from django.apps import AppConfig
# from Expenses.consul_registory import register_service

class ExpensesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Expenses'

    # def ready(self):
    #     # Register the service with Consul when the app is ready
    #     register_service()
