from rest_framework.request import Request
import requests
from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from datetime import *

def home(request):
    return HttpResponse("Hello World 8002")

@api_view(['GET'])
def adminFilterReport(request):
    try:
        
        userName = request.query_params.get('user')
        exp_name = request.query_params.get('exp_name')
        amount = request.query_params.get('amount')
        location = request.query_params.get('location')
        startDate = request.query_params.get('start_date')
        endDate = request.query_params.get('end_date')

        print(endDate)
        print(exp_name)
        print("hii")

        user_data = []
        fltruser = {}

        
        if not any([userName, exp_name, amount, location, startDate, endDate]):
            users = Expenses.objects.all()
            print("Fetching all expenses")

            user_data = [{
                'name': User.objects.get(id=j.userid.id).name,
                'expname': j.name,
                'amount': j.amount,
                'date': j.date,
                'location': j.location
            } for j in users]

            return JsonResponse({"filtered_data": user_data})

        
        if userName:
            try:
                userid = User.objects.get(name=userName).id
                fltruser['userid'] = userid
            except User.DoesNotExist:
                return JsonResponse({"filtered_data": []})

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

            users = Expenses.objects.filter( **fltruser,
                                                date__gte = startDate, 
                                                )

            for j in users:
                user = User.objects.get(id = j.userid.id)
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
            users = Expenses.objects.filter( **fltruser,
                                                # date__gte = startDate,
                                                date__lte = endDate
                                                )

            for j in users:
                user = User.objects.get(id = j.userid.id)
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

            users = Expenses.objects.filter( **fltruser,
                                                date__gte = startDate,
                                                date__lte = endDate
                                                )

            for j in users:
                user = User.objects.get(id = j.userid.id)
                user_data.append({
                    'name': user.name,
                    'expname': j.name,
                    'amount': j.amount,
                    'date': j.date,
                    'location': j.location
                })

        else:
            print("hii5")
            expenses = Expenses.objects.filter(**fltruser)
            user_data = [{
            'name': User.objects.get(id=expense.userid.id).name,
            'expname': expense.name,
            'amount': expense.amount,
            'date': expense.date,
            'location': expense.location
            } for expense in expenses]

            print(user_data)

        


        return JsonResponse({"filtered_data": user_data})

    except Exception as ex:
        print("Error:", ex)
        return JsonResponse({"filtered_data": "Some error has occurred"})

@api_view(['GET'])
def userFilteredReport(request):
    try:
        
        inUserid = request.query_params.get('id')
        exp_name = request.query_params.get('exp_name')
        amount = request.query_params.get('amount')
        location = request.query_params.get('location')
        startDate = request.query_params.get('start_date')
        endDate = request.query_params.get('end_date')

        print(type(inUserid))
        print(endDate)
        print(exp_name)
        print("hii")

        user_data = []
        fltruser = {}

        
        if not any([exp_name, amount, location, startDate, endDate]):
            users = Expenses.objects.filter(userid = inUserid)
            print("Fetching all expenses")

            print(users)

            user_data = [{
                'name': User.objects.get(id= j.userid.id).name,
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

            users = Expenses.objects.filter( **fltruser,
                                                date__gte = startDate,
                                                
                                                )

            for j in users:
                user = User.objects.get(id = j.userid.id)
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
            users = Expenses.objects.filter( **fltruser,
                                                # date__gte = startDate,
                                                date__lte = endDate
                                                )

            for j in users:
                user = User.objects.get(id = j.userid.id)
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

            users = Expenses.objects.filter( **fltruser,
                                                date__gte = startDate,
                                                date__lte = endDate
                                                )

            for j in users:
                user = User.objects.get(id = j.userid.id)
                user_data.append({
                    'name': user.name,
                    'expname': j.name,
                    'amount': j.amount,
                    'date': j.date,
                    'location': j.location
                })

        else:
            expenses = Expenses.objects.filter(**fltruser)
            user_data = [{
            'name': User.objects.get(id= expense.userid.id).name,
            'expname': expense.name,
            'amount': expense.amount,
            'date': expense.date,
            'location': expense.location
            } for expense in expenses]

        
        print(user_data)

        return JsonResponse({"filtered_data": user_data})

    except Exception as ex:
        print("Error:", ex)
        return JsonResponse({"filtered_data": []})


@api_view(['GET'])
def userReport(request):
    try:
        user_email = request.query_params.get('email')
        today_date = date.today()

        expense_response = requests.get(f'http://localhost:8001/userReportExpense?userid={user_email}&month={today_date.month}&year={today_date.year}')

        if expense_response.status_code == 200:
            exp_data = expense_response.json().get('user_exp')
            return JsonResponse({"user_exp": exp_data})

        else:
            return JsonResponse({"message": "Error fetching data from userReportExpense"}, status=400)

    except Exception as ex:
        print(ex)
        return JsonResponse({"message": "An error occurred"}, status=500)


@api_view(['GET'])
def adminReport(request):
    try:
        # Step 1: Get the user count from the userManagment service (localhost:8000)
        user_response = requests.get('http://localhost:8000/findUserCount')  # Assuming you have an endpoint that returns the user count
        if user_response.status_code == 200:
            user_data = user_response.json()
            user_cnt = user_data.get("user_cnt", 0)
        else:
            return JsonResponse({"message": "Error fetching user data"}, status=user_response.status_code)

        print(f"Total Users: {user_cnt}")
        
        today_date = date.today()
        month, year = today_date.month, today_date.year
        

        expense_response = requests.get(f'http://localhost:8001/adminReportExpense?month={month}&year={year}')
        if expense_response.status_code == 200:
            total_exp = expense_response.json().get('total_exp',0)
            # total_exp = expense_data.get("user_exp", {}).get("total_exp", 0)
        else:
            return JsonResponse({"message": "Error fetching expense data"}, status=expense_response.status_code)

        print(f"Total Expense: {total_exp}")

 
        if user_cnt > 0:
            exp_per_user = total_exp / user_cnt
        else:
            exp_per_user = 0

        print(f"Expense per User: {exp_per_user}")

        # Step 4: Prepare the response data
        user_data = {
            "total_user": user_cnt,
            "total_exp": total_exp,
            "exp_per_user": exp_per_user
        }

        return JsonResponse({"user_data": user_data}, status=200)

    except Exception as ex:
        print(f"Error: {ex}")
        return JsonResponse({"message": "Some error has occurred"}, status=500)
