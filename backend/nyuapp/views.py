from django.core.paginator import Paginator
from .models import Question
from django.http import HttpResponse
from django.core import serializers

def get_questions(request):
    questions_all = Question.objects.all()
    questions_json = serializers.serialize('json', questions_all)
    return HttpResponse(questions_json, content_type='application/json')

def get_paginated_questions(request,cur_page,single_page_count):
    questions_all = Question.objects.all()
    paginator = Paginator(questions_all,single_page_count)
    questions = paginator.page(cur_page)
    questions_json = serializers.serialize('json', questions)
    return HttpResponse(questions_json, content_type='application/json')