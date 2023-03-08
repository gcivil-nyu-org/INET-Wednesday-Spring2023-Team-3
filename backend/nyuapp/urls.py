from django.urls import path
from . import views
from .views import RegisterUserAPIView, MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("questions/", views.get_questions, name="get_questions"),
    path("post-question/", views.post_question, name="post_question"),
    path("register/", RegisterUserAPIView.as_view(), name="auth_register"),
    path("login/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
