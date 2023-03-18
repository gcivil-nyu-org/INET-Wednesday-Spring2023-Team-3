from django.urls import path
<<<<<<< HEAD:backend/nyuapp/urls.py
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
=======
from .views import RegisterUserAPIView, MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserAPIView.as_view(), name="auth_register"),
    path("login/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
>>>>>>> 4005745b (1) Modularizing nyuapp into onbarding & questions):backend/onboarding/urls.py
