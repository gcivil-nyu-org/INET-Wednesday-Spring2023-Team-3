from django.urls import path
from .views import get_user_type

urlpatterns = [
    path("get_user_type/<str:email>/", get_user_type, name="get_user_type"),
]
