from django.core.paginator import Paginator
from .models import Question
from django.http import HttpResponse
from django.core import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from nyuapp.serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


def get_questions(request):
    questions_all = Question.objects.all()
    questions_json = serializers.serialize("json", questions_all)
    return HttpResponse(questions_json, content_type="application/json")


def get_paginated_questions(request, cur_page, single_page_count):
    questions_all = Question.objects.all()
    paginator = Paginator(questions_all, single_page_count)
    questions = paginator.page(cur_page)
    questions_json = serializers.serialize("json", questions)
    return HttpResponse(questions_json, content_type="application/json")


class UserCreate(APIView):
    """
    Creates the user.
    """

    def post(self, request, format="json"):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json["token"] = token.key
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
