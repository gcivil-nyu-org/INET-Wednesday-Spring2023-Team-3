from django.http import JsonResponse
from .models import MyUser


def get_user_type(request, email):
    try:
        user = MyUser.objects.get(email=email)
        user_type = user.user_type
        response_data = {"user_type": user_type}
        return JsonResponse(response_data)
    except MyUser.DoesNotExist:
        response_data = {"error": "User not found"}
        return JsonResponse(response_data, status=404)
