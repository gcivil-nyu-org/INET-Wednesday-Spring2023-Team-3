from django.urls import path

from . import views

urlpatterns = [
    path('questions/',views.get_questions, name = "get_questions"),
    path('questions/cur_page/<int:cur_page>/single_page_count/<int:single_page_count>', views.get_paginated_questions, name = "get_paginated_questions")
]