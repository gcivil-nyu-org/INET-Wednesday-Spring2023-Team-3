from django.urls import path

from . import views
from .views import UserDetailAPI, RegisterUserAPIView

urlpatterns = [
    path("questions/", views.get_questions, name="get_questions"),
    path("post-question/",views.post_question, name = "post_question"),
    path("get-details/", UserDetailAPI.as_view()),
    path("register/", RegisterUserAPIView.as_view()),
]
