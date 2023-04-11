from django.urls import path
from . import views

urlpatterns = [
    path("get-starter-code/", views.get_starter_code, name="get_starter_code"),
    path("post-answer", views.post_coding_answer, name="post_answer"),
]
