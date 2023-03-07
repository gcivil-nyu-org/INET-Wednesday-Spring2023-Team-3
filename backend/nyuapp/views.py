from django.core.paginator import Paginator
from .models import Question,Difficulty,Company
from django.http import JsonResponse
from django.core import serializers
from django.http import HttpResponse
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from nyuapp.serializers import UserSerializer, RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics

def error_response(error_dict, err_msg:str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg
    error_dict["question_data"] = []
    error_dict["total_question_count"] = 0

    return JsonResponse(error_dict)

def get_questions(request):
    response_dict = {}
    difficulties = Difficulty.objects.all()
    response_dict["difficulties"] = [diff.pk for diff in difficulties]
    companies = Company.objects.all()
    response_dict["companies"] = [company.pk for company in companies]
    questions = Question.objects.all()
    param_names = ["difficulty","type","company","title","cur_page","single_page_count"]
    params = request.GET
    param_vals = [params.get(key) for key in param_names]
    if param_vals[0]:
        difficulties = difficulties.filter(text=param_vals[0])
        if not difficulties.count():
            return error_response(response_dict, "Error: Difficulty not found. Enter a valid difficulty level!")
        questions = questions.filter(difficulty=param_vals[0])
    if param_vals[1]:
        questions = questions.filter(type=param_vals[1])
    if param_vals[2]:
        companies = companies.filter(name=param_vals[2])
        if not companies.count():
            return error_response(response_dict, "Error: Company not found!")
        questions = questions.filter(companies__icontains=param_vals[2])
    if param_vals[3]:
        questions = questions.filter(title__icontains=param_vals[3])
    
    response_dict["total_question_count"] = questions.count()
    if param_vals[4] and param_vals[5]:
        if not param_vals[4].isdigit() or not param_vals[5].isdigit():
            return error_response(response_dict, "Error: Pagination params not valid!")
        cur_page,single_page_count = int(param_vals[4]),int(param_vals[5])
        paginator = Paginator(questions,single_page_count)
        questions = paginator.page(cur_page)
        
    response_dict["question_data"] = json.loads(serializers.serialize('json',questions))
    response_dict["error_msg"] = ""
    response_dict["status"] = 200

    return JsonResponse(response_dict)


# Class based view to Get User Details using Token Authentication
class UserDetailAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data)


# Class based view to register user
class RegisterUserAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


