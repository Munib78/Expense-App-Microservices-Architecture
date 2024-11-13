# # expenses/consul_registration.py
# from consul import Consul

# def register_service():
#     consul = Consul()

#     service = {
#         "service_id": "expense-service",  # Unique service ID
#         "name": "expense-service",
#         "tags": ["django", "api"],
#         "address": "127.0.0.1",  # Replace with your app's host
#         "port": 8002,  # Replace with your app's port
#         "check": {
#             "http": "http://127.0.0.1:8002/health_check",  # Health check endpoint
#             "interval": "10s"
#         }
#     }

#     consul.agent.service.register(**service)
