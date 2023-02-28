from django.urls import path

from . import views

urlpatterns = [
    # path('', views.ListTodo.as_view()),
    # path('<int:pk>/', views.DetailTodo.as_view()),
    path('questions/',views.get_questions, name = "get_questions")
]