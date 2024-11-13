import requests
import pybreaker
import consul
import socket
from django.conf import settings
from django.shortcuts import render
from Expenses.serializers import * 
from rest_framework.request import Request
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.http import HttpResponse
from datetime import *
# Create your views here.



breaker = pybreaker.CircuitBreaker(fail_max=3, reset_timeout=60)
print(breaker.state.name)
# print(pybreaker.CircuitBreaker.open)
consul_client = consul.Consul(host='localhost', port=8500)  # Replace 'localhost' with Consul server IP if necessary

# Function to register service
def register_service_with_consul():
    service_name = "expense_service"
    service_id = f"{service_name}-{socket.gethostname()}"

    # Register the service with Consul
    consul_client.agent.service.register(
        name=service_name,
        service_id=service_id,
        address=socket.gethostbyname(socket.gethostname()),  # Local IP address
        port=8002,  # Your Django port
        check=consul.Check.http(f'http://{socket.gethostbyname(socket.gethostname())}:8002/health_check', interval="10s", timeout="5s")
    )
    print(f"{service_name} registered with Consul under ID {service_id}")

# Call the registration function on app startup
register_service_with_consul()

@breaker
def get_expenses_from_db(user_id):
    return Expense.objects.filter(userid=user_id)



def home(request):
    return HttpResponse("Hello World port 8002")


@api_view(['POST'])
def addExpense(request):
    serializer = ExpensesModel(data = request.data)

    if serializer.is_valid():
        serializer.save()

        return JsonResponse({"message" : "Expense added successfully"})

    else:
        return JsonResponse({"message" : "Some error has occurred."})

@api_view(['PUT'])
def editExpense(request):
    try:
        expense = request.data
        print(expense)
        expid = expense.get('id')

        serializers = ExpensesModel(data = request.data)

        if serializers.is_valid():
            editexpense = Expense.objects.get(id = expid)

            editexpense.name = expense.get('name')
            editexpense.amount = expense.get('amount')
            editexpense.location = expense.get('location')
            editexpense.date = expense.get('date')

            editexpense.save()

            return JsonResponse({"message": "Updated successfully"}) 

    
    except Expense.DoesNotExist:
        return JsonResponse({"message": "Expense not found"})
    except Exception as e:
        return JsonResponse({"message": f"Some error has occurred: {str(e)}"})


@api_view(['GET'])
def retriveExpense(request):
    user_id = request.query_params.get('email')

    # Call the userManagment service to retrieve user details based on email
    try:
        # user_response = requests.get(f'http://localhost:8000/findUser?email={email}')
        
        # if user_response.status_code == 200:
            # user_data = user_response.json()
            # print(user_data)

            # Assuming the user exists and user_data contains necessary details
            # Proceed to fetch expenses
            # user_id = user_data["user_data"]["id"]
        print(user_id)
        list_expenses = Expense.objects.filter(userid=user_id)
        print(list_expenses)

        if list_expenses.exists():
            expenses_data = [
                {
                    "id": expense.id,
                    "name": expense.name,
                    "amount": expense.amount,
                    "date": expense.date,
                    "location": expense.location
                } 
                for expense in list_expenses
            ]
            print(list_expenses)
            return JsonResponse({"expenses": expenses_data})
        else:
            print("NO")
            return JsonResponse({"message": "No expense Found"})
    
    except pybreaker.CircuitBreakerError:
        return JsonResponse({"message": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except requests.exceptions.RequestException as e:
        # Catch errors like connection issues
        return JsonResponse({"message": str(e)}, status=500)
    

@api_view(["DELETE"])
def deleteExpense(request):
    try:

        exp = request.query_params.get('id') 
        print(exp)

        expobj = Expense.objects.get(id = exp)
        print(expobj)

        expobj.delete()

        return JsonResponse({"message": "Deleted Successfully"})
    
    except Exception as ex:

        return JsonResponse({"message": "Some Error has occurred"})

@api_view(["GET"])
def userReportExpense(request):
    try:
        print("hii")
        user_id = request.GET.get('email')
        # month = request.GET.get('month')
        # year = request.GET.get('year')
        today_date = datetime.today().date()
        print(user_id)
        expense = Expense.objects.filter(userid = user_id, date__month = today_date.month, date__year = today_date.year)

        if(len(expense) == 0):
            user_exp = {
                "total_exp": 0,
                "avg_exp": 0
            }

            return JsonResponse({"user_exp": user_exp})

        print(expense)
        total_exp = 0
        avg_exp = 0

        for j in expense:
            total_exp = total_exp + j.amount

            

        avg_exp = total_exp/ len(expense)
        print(avg_exp)

        user_exp = {
                "total_exp": total_exp,
                "avg_exp": avg_exp
        }

        print(user_exp)

        return JsonResponse({"user_exp": user_exp}, status = 200)

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"user_exp": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        print(ex)
        return JsonResponse({"user_exp": "Some Error has occurred"})

@api_view(["GET"])
def admin_graph_expense(requests):
    expenses = Expense.objects.all()

    user_exp = []

    for expense in expenses:
        exp = {
            "name": expense.name,
            "amount": expense.amount,
            "date": expense.date
        }

        user_exp.append(exp)


    return JsonResponse({"expenses": user_exp})

@api_view(["GET"])
def user_graph_expense(requests):
    id = requests.query_params.get('id') 
    expenses = Expense.objects.filter(userid = id)

    user_exp = []

    for expense in expenses:
        exp = {
            "name": expense.name,
            "amount": expense.amount,
            "date": expense.date
        }

        user_exp.append(exp)


    return JsonResponse({"expenses": user_exp})


@api_view(["GET"])
def adminReportExpense(request: Request):
    try:
        # month = request.GET.get('month')
        # year = request.GET.get('year')

        users = requests.get('http://127.0.0.1:8001/getusers')

        json_users = users.json()
        print(users.json())
        # print(json_users)

        num_users = json_users.get('user_data')
        print(len(num_users))
        
        today_date = datetime.today().date()
        expense = Expense.objects.filter(date__month= today_date.month, date__year = today_date.year)

        if(len(expense) == 0):
            user_exp = {
                "total_exp": 0,
                "avg_exp": 0
            }

            return JsonResponse({"user_exp": user_exp})

        print(expense)
        total_exp = 0
        # avg_exp = 0

        for j in expense:
            total_exp = total_exp + j.amount

            

        # avg_exp = total_exp/ len(expense)
        # print(avg_exp)

        user_exp = {
                "total_exp": total_exp,
                "exp_per_user": total_exp/len(num_users),
                "total_user": len(num_users)
        }

        print(user_exp)

        return JsonResponse({"user_data": user_exp }, status = 200)

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"user_data": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        print(ex)
        return JsonResponse({"user_data": "Some Error has occurred"})


@api_view(['GET'])
def adminFilterReport(request):
    try:
        # Retrieve query parameters
        userName = request.query_params.get('user')
        exp_name = request.query_params.get('exp_name')
        amount = request.query_params.get('amount')
        location = request.query_params.get('location')
        startDate = request.query_params.get('start_date')
        endDate = request.query_params.get('end_date')

        user_data = []
        fltruser = {}

        # If no filters are provided, fetch all expenses
        if not any([userName, exp_name, amount, location, startDate, endDate]):
            print("hii")
            expenses = Expense.objects.all()
        else:
            # 1. Check for user existence in the userManagement microservice
            if userName:
                user_response = requests.get(f'http://127.0.0.1:8001/findUser_by_name?name={userName}')
                if user_response.status_code == 200:
                    userid = user_response.json().get('userid')
                    fltruser['userid'] = userid
                else:
                    return JsonResponse({"filtered_data": []})  # User not found

            if exp_name:
                fltruser['name'] = exp_name
            if amount:
                fltruser['amount'] = amount
            if location:
                fltruser['location'] = location

            # 2. Date filtering logic
            if startDate:
                startDate = datetime.strptime(startDate, '%Y-%m-%d')
                fltruser['date__gte'] = startDate
            if endDate:
                endDate = datetime.strptime(endDate, '%Y-%m-%d')
                fltruser['date__lte'] = endDate

            # 3. Fetch expenses based on filters
            expenses = Expense.objects.filter(**fltruser)


        # Process expenses and fetch usernames
        for expense in expenses:
            print(expense.name, expense.amount, expense.location, expense.userid, expense.id)
            user_response = requests.get(f'http://127.0.0.1:8001/findUser_id?id={expense.userid}')
            user_name = user_response.json().get('username', 'Unknown')
            print(user_name)

            user_data.append({
                'name': user_name,
                'expname': expense.name,
                'amount': expense.amount,
                'date': expense.date,
                'location': expense.location
            })

        return JsonResponse({"filtered_data": user_data})

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"filtered_data": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        print("Error:", ex)
        return JsonResponse({"filtered_data": "Some error has occurred"})

@api_view(['GET'])
def userFilteredReport(request):
    try:
        
        inUserid = int(request.query_params.get('id'))
        exp_name = request.query_params.get('exp_name')
        amount = request.query_params.get('amount')
        location = request.query_params.get('location')
        startDate = request.query_params.get('start_date')
        endDate = request.query_params.get('end_date')

        print(type(inUserid))
        print(endDate)
        print(exp_name)
        print("hii")

        username = requests.get(f'http://127.0.0.1:8001/findUser_id?id={inUserid}')

        user_data = []
        fltruser = {}

        print(username.json().get('username'))

        
        if not any([exp_name, amount, location, startDate, endDate]):
            users = Expense.objects.filter(userid = inUserid)
            print("Fetching all expenses")

            print(users)

            user_data = [{
                'name': username.json().get('username'),
                'expname': j.name,
                'amount': j.amount,
                'date': j.date,
                'location': j.location
            } for j in users]

            return JsonResponse({"filtered_data": user_data})

        fltruser['userid'] = inUserid

        if exp_name:
            fltruser['name'] = exp_name
        
        if amount:
            fltruser['amount'] = amount
        
        if location:
            fltruser['location'] = location

        print(fltruser)

        if startDate and (not endDate):
            print("hii2")
            startDate = datetime.strptime(startDate, '%Y-%m-%d')
            # endDate = datetime.strptime(endDate, '%Y-%m-%d')

            users = Expense.objects.filter( **fltruser,
                                                date__gte = startDate,
                                                
                                                )

            for j in users:
                user = username.json().get('username')
                user_data.append({
                    'name': user.name,
                    'expname': j.name,
                    'amount': j.amount,
                    'date': j.date,
                    'location': j.location
                })

        elif (not startDate) and endDate:
            # startDate = datetime.strptime(startDate, '%Y-%m-%d')
            print("hii3")
            endDate = datetime.strptime(endDate, '%Y-%m-%d')
            print(endDate)
            users = Expense.objects.filter( **fltruser,
                                                # date__gte = startDate,
                                                date__lte = endDate
                                                )

            for j in users:
                user = username.json().get('username')
                user_data.append({
                    'name': user.name,
                    'expname': j.name,
                    'amount': j.amount,
                    'date': j.date,
                    'location': j.location
                })
            
            print(user_data)

        elif startDate and endDate :
            # fltruser['start_date']
            print("hii4")
            print(type(startDate))
            startDate = datetime.strptime(startDate, '%Y-%m-%d')
            endDate = datetime.strptime(endDate, '%Y-%m-%d')

            users = Expense.objects.filter( **fltruser,
                                                date__gte = startDate,
                                                date__lte = endDate
                                                )

            for j in users:
                user = username.json().get('username')
                user_data.append({
                    'name': user.name,
                    'expname': j.name,
                    'amount': j.amount,
                    'date': j.date,
                    'location': j.location
                })

        else:
            expenses = Expense.objects.filter(**fltruser)
            user_data = [{
            'name': username.json().get('username'),
            'expname': expense.name,
            'amount': expense.amount,
            'date': expense.date,
            'location': expense.location
            } for expense in expenses]

        
        print(user_data)

        return JsonResponse({"filtered_data": user_data})

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"filtered_data": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        print("Error:", ex)
        return JsonResponse({"filtered_data": []})


@api_view(['GET'])
def health_check(request):
    try:
        
        if breaker.state == "open":
            return JsonResponse({"status": "unhealthy", "message": "Service is down due to repeated failures."}, status=503)
        
        
        return JsonResponse({"status": "healthy", "message": "Service is running smoothly."}, status=200)
    
    except Exception as e:
        return JsonResponse({"status": "unhealthy", "message": f"Error: {str(e)}"}, status=500)
    



# @api_view(['GET'])
# def adminFilterReport(request):
#     try:
        
#         userName = request.query_params.get('user')
#         exp_name = request.query_params.get('exp_name')
#         amount = request.query_params.get('amount')
#         location = request.query_params.get('location')
#         startDate = request.query_params.get('start_date')
#         endDate = request.query_params.get('end_date')

#         print(endDate)
#         print(exp_name)
#         print("hii")

#         user_data = []
#         fltruser = {}

        
#         if not any([userName, exp_name, amount, location, startDate, endDate]):
#             users = Expenses.objects.all()
#             print("Fetching all expenses")

#             user_data = [{
#                 'name': User.objects.get(id=j.userid.id).name,
#                 'expname': j.name,
#                 'amount': j.amount,
#                 'date': j.date,
#                 'location': j.location
#             } for j in users]

#             return JsonResponse({"filtered_data": user_data})

        
#         if userName:
#             try:
#                 userid = User.objects.get(name=userName).id
#                 fltruser['userid'] = userid
#             except User.DoesNotExist:
#                 return JsonResponse({"filtered_data": []})

#         if exp_name:
#             fltruser['name'] = exp_name
        
#         if amount:
#             fltruser['amount'] = amount
        
#         if location:
#             fltruser['location'] = location

#         print(fltruser)

#         if startDate and (not endDate):
#             print("hii2")
#             startDate = datetime.strptime(startDate, '%Y-%m-%d')
#             # endDate = datetime.strptime(endDate, '%Y-%m-%d')

#             users = Expenses.objects.filter( **fltruser,
#                                                 date__gte = startDate, 
#                                                 )

#             for j in users:
#                 user = User.objects.get(id = j.userid.id)
#                 user_data.append({
#                     'name': user.name,
#                     'expname': j.name,
#                     'amount': j.amount,
#                     'date': j.date,
#                     'location': j.location
#                 })

#         elif (not startDate) and endDate:
#             # startDate = datetime.strptime(startDate, '%Y-%m-%d')
#             print("hii3")
#             endDate = datetime.strptime(endDate, '%Y-%m-%d')
#             print(endDate)
#             users = Expenses.objects.filter( **fltruser,
#                                                 # date__gte = startDate,
#                                                 date__lte = endDate
#                                                 )

#             for j in users:
#                 user = User.objects.get(id = j.userid.id)
#                 user_data.append({
#                     'name': user.name,
#                     'expname': j.name,
#                     'amount': j.amount,
#                     'date': j.date,
#                     'location': j.location
#                 })
            
#             print(user_data)

#         elif startDate and endDate :
#             # fltruser['start_date']
#             print("hii4")
#             print(type(startDate))
#             startDate = datetime.strptime(startDate, '%Y-%m-%d')
#             endDate = datetime.strptime(endDate, '%Y-%m-%d')

#             users = Expenses.objects.filter( **fltruser,
#                                                 date__gte = startDate,
#                                                 date__lte = endDate
#                                                 )

#             for j in users:
#                 user = User.objects.get(id = j.userid.id)
#                 user_data.append({
#                     'name': user.name,
#                     'expname': j.name,
#                     'amount': j.amount,
#                     'date': j.date,
#                     'location': j.location
#                 })

#         else:
#             print("hii5")
#             expenses = Expenses.objects.filter(**fltruser)
#             user_data = [{
#             'name': User.objects.get(id=expense.userid.id).name,
#             'expname': expense.name,
#             'amount': expense.amount,
#             'date': expense.date,
#             'location': expense.location
#             } for expense in expenses]

#             print(user_data)

        


#         return JsonResponse({"filtered_data": user_data})

#     except Exception as ex:
#         print("Error:", ex)
#         return JsonResponse({"filtered_data": "Some error has occurred"})

