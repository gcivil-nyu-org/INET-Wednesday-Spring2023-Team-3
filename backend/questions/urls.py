from django.urls import path
from . import views

urlpatterns = [
    path("get-questions/", views.get_questions, name="get_questions"),
    path("post-question/", views.post_question, name="post_question"),
]
