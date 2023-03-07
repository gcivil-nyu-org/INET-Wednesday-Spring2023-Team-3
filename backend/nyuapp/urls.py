from django.urls import path

from . import views

urlpatterns = [
    path("questions/", views.get_questions, name="get_questions"),
    path("post-question/",views.post_question, name = "post_question"),
    path("register/", views.UserCreate.as_view(), name="account-create"),
]
