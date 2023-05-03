from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MyUser
import json


def get_user_type(request, email):
    try:
        user = MyUser.objects.get(email=email)
        user_type = user.user_type
        response_data = {"user_type": user_type}
        return JsonResponse(response_data)
    except MyUser.DoesNotExist:
        response_data = {"error": "User not found"}
        return JsonResponse(response_data, status=404)


@csrf_exempt
def search_users(request):
    users = MyUser.objects.all()
    users_list = [
        {"id": user.id, "name": user.get_full_name(), "email": user.email}
        for user in users
    ]
    return JsonResponse({"users": users_list})


@csrf_exempt
def add_friend(request):
    if request.method == "POST":
        data = json.loads(request.body.decode())
        user_id = data.get("user_id")
        friend_id = data.get("friend_id")
        user = get_object_or_404(MyUser, id=user_id)
        friend = get_object_or_404(MyUser, id=friend_id)
        user.friends.add(friend)
        user.save()
        return JsonResponse({"status": "success"})
    else:
        return JsonResponse({"status": "error"})


@csrf_exempt
def remove_friend(request):
    if request.method == "POST":
        data = json.loads(request.body.decode())
        user_id = data.get("user_id")
        friend_id = data.get("friend_id")
        user = get_object_or_404(MyUser, id=user_id)
        friend = get_object_or_404(MyUser, id=friend_id)
        user.friends.remove(friend)
        user.save()
        return JsonResponse({"status": "success"})
    else:
        return JsonResponse({"status": "error"})


@csrf_exempt
def friends_list(request, user_id):
    # print(MyUser.objects.all())
    user = get_object_or_404(MyUser, id=user_id)
    friends = user.friends.all()
    friends_list = [
        {"id": friend.id, "name": friend.get_full_name()} for friend in friends
    ]
    return JsonResponse({"friends": friends_list})
