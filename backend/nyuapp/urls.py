from django.urls import path
from . import views
from nyuapp.views import (
    UserRegistrationAPIView,
    UserLoginAPIView,
    UserViewAPI,
    UserLogoutViewAPI,
)


urlpatterns = [
    path("questions/", views.get_questions, name="get_questions"),
    path("post-question/", views.post_question, name="post_question"),
    path("user/register/", UserRegistrationAPIView.as_view()),
    path("user/login/", UserLoginAPIView.as_view()),
    path("user/", UserViewAPI.as_view()),
    path("user/logout/", UserLogoutViewAPI.as_view()),
]
