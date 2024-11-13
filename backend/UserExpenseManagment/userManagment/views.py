import requests,pybreaker, socket, consul
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from userManagment import models
from userManagment.serializers import * 
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import *
from django.core.mail import send_mail
from datetime import *

breaker = pybreaker.CircuitBreaker(fail_max=3, reset_timeout=60)

consul_client = consul.Consul(host='localhost', port=8500)

# Function to register service
def register_service_with_consul():
    service_name = "user_management_service"
    service_id = f"{service_name}-{socket.gethostname()}"

    consul_client.agent.service.register(
        name=service_name,
        service_id=service_id,
        address=socket.gethostbyname(socket.gethostname()),  # Local IP address
        port=8001,  # Adjust to match your service's port
        check=consul.Check.http(f'http://{socket.gethostbyname(socket.gethostname())}:8001/health_check', interval="10s", timeout="5s")
    )
    print(f"{service_name} registered with Consul under ID {service_id}")

# Register service at startup
register_service_with_consul()


# Wrapper for the database interaction to handle circuit breaker logic
@breaker
def get_expenses_from_db(user_id):
    return User.objects.filter(userid=user_id)


def home(request):
    return HttpResponse("Hello World 8001")


@api_view(['POST'])
def addAdminuser(request):
    serializer = UserModel(data = request.data)

    if serializer.is_valid():
        # password = request.data.password

        hasspass = make_password(password= serializer.validated_data['password'])

        serializer.save(password = hasspass)

        if(serializer.validated_data['role'] == 'User'):
            return JsonResponse({"message": "User created successfully"})
        
        else:
            return JsonResponse({"message": "Admin created successfully"})


@api_view(['GET'])
def getusers(request):
    try:
            
        users = User.objects.all()

        users_data = [
            {"id": user.id, "name": user.name, "email_add": user.email_add, 
            "mobile_no": user.mobile_no, "user_name": user.user_name, "role": user.role}
            for user in users
        ]

        return JsonResponse({"user_data": users_data})

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"user_data": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        print(ex)

@api_view(['GET'])
def findUser(request):
    email = request.query_params.get('email')

    try:
        user = User.objects.get(email_add=email)
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email_add,
            "mobile_no": user.mobile_no,
            "username": user.user_name
        }
        return JsonResponse({"user_data": user_data}, status=200)
    
    except pybreaker.CircuitBreakerError:
        return JsonResponse({"user_data": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except User.DoesNotExist:
        return JsonResponse({"user_data": "User not found"}, status=404)

@api_view(['GET'])
def findUserCount(request):
    try:
        user_cnt = User.objects.count()
        return JsonResponse({"user_cnt": user_cnt}, status=200)
    
    except pybreaker.CircuitBreakerError:
        return JsonResponse({"message": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        return JsonResponse({"message": "Error fetching user count"}, status=500)

@api_view(['GET'])
def findUser_by_name(request):
    user_name = request.query_params.get('name')
    try:
        user_obj = User.objects.get(name=user_name)
        return JsonResponse({"userid": user_obj.id, "username": user_obj.name})
    
    except pybreaker.CircuitBreakerError:
        return JsonResponse({"error": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

@api_view(['GET'])
def findUser_id(request: requests):
    try:
        userid = request.query_params.get('id')

        print(userid)

        user_obj = User.objects.get(id = userid)

        print(user_obj.name )
        return JsonResponse({"username" : user_obj.name})

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"username": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except Exception as ex:
        print(ex)

@api_view(['PUT'])
def editUser(request):
    user_data = request.data

    print(user_data)
    userid = user_data.get('id')

    # serializer = UserModel(data = request.data)

    # if serializer.is_valid():
    try:
        user = User.objects.get(id=userid)
        user.name = user_data.get('name')
        user.mobile_no = user_data.get('mobile_no')
        user.user_name = user_data.get('user_name')
        
        user.save()
        return JsonResponse({"message": "User updated successfully"})
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"})

@api_view(['DELETE'])
def deleteUser(request):
    email = request.query_params.get('email')

    user = User.objects.get(email_add = email)

    user.delete()

    return JsonResponse({"message": "User deleted successfully"})


@api_view(['GET'])
def login(request):
    email = request.query_params.get('email')  # Since you're using GET, data will be in query_params
    password = request.query_params.get('password')

    # enc_pass = make_password(password)
    # user = authenticate(request, username=username, password=password)
    print(email)
    print(password)
    try:
        user = User.objects.get(email_add = email)
        checkpassword= check_password(password, user.password)

        if checkpassword:
            usr = {"id": user.id, "name": user.name, "email_add": user.email_add, 
         "mobile_no": user.mobile_no, "user_name": user.user_name, "role": user.role}
            
            return JsonResponse({"message": "Login successful!", "user": usr})
        else:
            
            return JsonResponse({"message": "Invalid credentials"})

    except pybreaker.CircuitBreakerError:
        return JsonResponse({"message": "Service unavailable due to failure threshold reached. Please try again later."}, status=503)
    
    except user.DoesNotExist:
        return JsonResponse({"message": "User not found"})

@api_view(['POST'])
def sign_up(request):
    serializer = UserModel(data=request.data)

    if serializer.is_valid():
        
        hashed_password = make_password(serializer.validated_data['password'])
        serializer.save(password=hashed_password) 

        return JsonResponse({"message": "User created successfully"})
    
    print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)


@api_view(['GET'])
def health_check(request):
    try:
        # Check if the circuit breaker is open
        if breaker.state.name == "open":
            return JsonResponse({"status": "unhealthy", "message": "Service is down due to repeated failures."}, status=503)
        
        # Optionally, you could check the status of other dependencies here (e.g., database, other services)
        return JsonResponse({"status": "healthy", "message": "Service is running smoothly."}, status=200)
    
    except Exception as e:
        return JsonResponse({"status": "unhealthy", "message": f"Error: {str(e)}"}, status=500)


# @api_view(['POST'])
# def addExpense(request):
#     serializer = Expens(data = request.data)

#     if serializer.is_valid():
#         serializer.save()

#         return JsonResponse({"message" : "Expense added successfully"})

#     else:
#         return JsonResponse({"message" : "Some error has occurred."})


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

# @api_view(['GET'])
# def userFilteredReport(request):
#     try:
        
#         inUserid = request.query_params.get('id')
#         exp_name = request.query_params.get('exp_name')
#         amount = request.query_params.get('amount')
#         location = request.query_params.get('location')
#         startDate = request.query_params.get('start_date')
#         endDate = request.query_params.get('end_date')

#         print(type(inUserid))
#         print(endDate)
#         print(exp_name)
#         print("hii")

#         user_data = []
#         fltruser = {}

        
#         if not any([exp_name, amount, location, startDate, endDate]):
#             users = Expenses.objects.filter(userid = inUserid)
#             print("Fetching all expenses")

#             print(users)

#             user_data = [{
#                 'name': User.objects.get(id= j.userid.id).name,
#                 'expname': j.name,
#                 'amount': j.amount,
#                 'date': j.date,
#                 'location': j.location
#             } for j in users]

#             return JsonResponse({"filtered_data": user_data})

#         fltruser['userid'] = inUserid

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
#             expenses = Expenses.objects.filter(**fltruser)
#             user_data = [{
#             'name': User.objects.get(id= expense.userid.id).name,
#             'expname': expense.name,
#             'amount': expense.amount,
#             'date': expense.date,
#             'location': expense.location
#             } for expense in expenses]

        
#         print(user_data)

#         return JsonResponse({"filtered_data": user_data})

#     except Exception as ex:
#         print("Error:", ex)
#         return JsonResponse({"filtered_data": []})


# @api_view(['GET'])
# def userReport(request):
#     try:
#         user_email = request.query_params.get('email')
#         user = User.objects.get(email_add = user_email)

#         today_date = date.today()

#         print(user.name)

#         expense = Expenses.objects.filter(userid = user.id, date__month= today_date.month, date__year = today_date.year)

#         if(len(expense) == 0):
#             user_exp = {
#             "total_exp": 0,
#             "avg_exp": 0
#             }

#             return JsonResponse({"user_exp": user_exp})

#         print(expense)
#         total_exp = 0
#         avg_exp = 0

#         for j in expense:
#             total_exp = total_exp + j.amount

        

#         avg_exp = total_exp/ len(expense)
#         print(avg_exp)

#         user_exp = {
#             "total_exp": total_exp,
#             "avg_exp": avg_exp
#         }

#         print(user_exp)

#         return JsonResponse({"user_exp": user_exp})


#     except Exception as ex:
#         print(ex)
#         return JsonResponse({"message": "Some Error has occurred"})

# @api_view(['GET'])
# def adminReport(request):
#     try:
#         users = User.objects.all()
#         user_cnt = len(users)

#         print(user_cnt)
#         today_date = date.today()

#         exp = Expenses.objects.filter(date__month = today_date.month, date__year = today_date.year)

#         total_exp = 0

#         for j in exp:
#             total_exp = total_exp + j.amount
        
#         print(total_exp)
#         exp_per_user = total_exp / user_cnt

#         print(exp_per_user)
#         user_data = {
#             "total_user": user_cnt,
#             "total_exp": total_exp,
#             "exp_per_user": exp_per_user
#         }
        
#         return JsonResponse({"user_data": user_data})

#     except Exception as ex:
#         return JsonResponse({"message": "Some error ha soccurred"})


# @api_view(['PUT'])
# def editExpense(request):
#     try:
#         expense = request.data
#         print(expense)
#         expid = expense.get('id')

#         serializers = ExpensesModel(data = request.data)

#         if serializers.is_valid():
#             editexpense = Expenses.objects.get(id = expid)

#             editexpense.name = expense.get('name')
#             editexpense.amount = expense.get('amount')
#             editexpense.location = expense.get('location')
#             editexpense.date = expense.get('date')

#             editexpense.save()

#             return JsonResponse({"message": "Updated successfully"}) 

    
#     except Expenses.DoesNotExist:
#         return JsonResponse({"message": "Expense not found"})
#     except Exception as e:
#         return JsonResponse({"message": f"Some error has occurred: {str(e)}"})

# @api_view(['GET'])
# def retriveExpense(request):
#     user_id = request.query_params.get('email')

#     print(user_id)
#     # list_expenses = models.Expenses.objects.filter(userid = user_id)
   
#     try:
#         user = User.objects.get(email_add = user_id)
#         print(user)
#         list_expenses = Expenses.objects.filter(userid=user.id)
#         print(list_expenses)
        
#     except Expenses.DoesNotExist:
#         return JsonResponse({"message": "User not found"})


#     if list_expenses.exists():
#         expenses_data = [{"id":expense.id, "name": expense.name, "amount": expense.amount, "date": expense.date, "location": expense.location} for expense in list_expenses]
#         print(expenses_data)
#         return JsonResponse({"expenses": expenses_data})
    
#     else:   
#         return JsonResponse({"message": "No expense Found"})

# @api_view(["DELETE"])
# def deleteExpense(request):
#     try:

#         exp = request.query_params.get('id') 
#         print(exp)

#         expobj = Expenses.objects.get(id = exp)
#         print(expobj)

#         expobj.delete()

#         return JsonResponse({"message": "Deleted Successfully"})
    
#     except Exception as ex:

#         return JsonResponse({"message": "Some Error has occurred"})


# @api_view(['GET'])
# def adminFilterReport(request):
#     try:
            
#         userName = request.query_params.get('user')
#         exp_name = request.query_params.get('exp_name')
#         amount = request.query_params.get('amount')
#         location = request.query_params.get('location')
#         # startDate = request.GET.get('start_date', '')
#         # endDate = request.GET.get('end_date', '')

#         print(userName)
#         print(exp_name)
#         print("hii")

#         user_data = []
#         fltruser = {}

#         if (userName == '' and exp_name == '' and amount == '' and location == ''):
#             users = Expenses.objects.all()
#             # print(users.userid)
#             print("hii1")

#             for j in users:
#                 print(j)
#                 user = User.objects.get(id = j.userid.id)
#                 user_data.append({
#                     'name': user.name,
#                     'expname': j.name,
#                     'amount': j.amount,
#                     'date': j.date,
#                     'location': j.location
#                 })



#             return JsonResponse({"flitered_data": user_data}) 

#         if userName:
#             userid = User.objects.get(name = userName)
#             if user:
#                 fltruser['userid'] = userid.id
#             else:
#                 return JsonResponse({"flitered_data": "User not found"})
#             # fltruser['userid'] = userid.id
        
#         if exp_name:
#             fltruser['name'] = exp_name
        
#         if amount:
#             fltruser['amount']= amount
        
#         if location:
#             fltruser['location'] = location
        

#         # if startDate != '' and endDate != '':
#         #     # fltruser['start_date']
#         #     users = Expenses.objects.filter( **fltruser,
#         #                                         date__gte = startDate.date,
#         #                                         date__lte = endDate.year
#         #                                         )

#         #     for j in users:
#         #         user = User.objects.get(id = j.userid)
#         #         user_data.append({
#         #             'name': user.name,
#         #             'expname': j.name,
#         #             'amount': j.amount,
#         #             'date': j.date,
#         #             'location': j.location
#         #         })

#         # else:
#         user_data = Expenses.objects.filter( **fltruser)

#         return JsonResponse({"flitered_data": user_data})

#     except Exception as ex:
#         print(ex)
#         return JsonResponse({"flitered_data": "Some Error has occurred"})
  


# @api_view(['POST'])
# def send_otp(request):
#     email = request.data.get('email')

#     try:
#         print(email)
#         user = models.User.objects.get(email_add=email)
#         user.gen_otp()

#         # Send OTP to user's email
#         send_mail(
#             'Your OTP Code',
#             f'Your OTP code is {user.otp}',
#             '21ceuos149@ddu.ac.in',
#             [user.email_add],
#             fail_silently=False,
#         )

#         return Response({'message': 'OTP sent successfully!'}, status=200)
#     except models.User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=404)


# @api_view(['POST'])
# def verify_otp(request):
#     email = request.data.get('email')
#     otp = request.data.get('otp')

#     try:
#         user = models.User.objects.get(email_add=email)

#         if user.otp == otp:
#             user.is_verified = True
#             user.otp = None  # Clear OTP after verification
#             user.save()

#             return JsonResponse({'message': 'Email verified successfully!'}, status=200)
#         else:
#             return JsonResponse({'error': 'Invalid OTP'}, status=400)
        
#     except models.User.DoesNotExist:
#         return JsonResponse({'error': 'User not found'}, status=404)

