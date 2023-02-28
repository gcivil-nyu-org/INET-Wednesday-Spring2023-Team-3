# from django.shortcuts import generics
from django.core.paginator import Paginator

from .models import Todo
from .serializers import TodoSerializer
from .models import Question
from django.http import HttpResponse
from django.core import serializers

# class ListTodo(generics.ListCreateAPIView):
#     queryset = Todo.objects.all()
#     serializer_class = TodoSerializer

# class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Todo.objects.all()
#     serializer_class = TodoSerializer

def get_questions(request):
    questions_all = Question.objects.all()
    questions_json = serializers.serialize('json', questions_all)
    return HttpResponse(questions_json, content_type='application/json')




# od = ["Easy","Medium","Hard","Expert"]
# import csv
# from nyuapp.models import Question

# import random
# with open("C:/Users/Hp/Downloads/InterviewQuestions.csv") as f:
#     reader = csv.reader(f)
#     for row in reader:
#         _, created = Question.objects.get_or_create(
#             title=row[0],
#             difficulty=od[random.randint(0,3)],
#             type="Behavioural",
#             )