from django.urls import path
from .views import RegisterUserAPIView, MyObtainTokenPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterUserAPIView.as_view(), name="auth_register"),
    path("login/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]