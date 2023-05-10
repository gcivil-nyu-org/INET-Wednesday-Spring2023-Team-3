from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import MyUser
import json
from django.db.models import Q
from userprofile.models import StudentAlumniProfile, CompanyProfile
from django.core import serializers
from django.core.paginator import Paginator


def get_user_type(request, email):
    try:
        user = MyUser.objects.get(email=email)
        user_type = user.user_type
        userID = user.id
        response_data = {"user_type": user_type, "userID": userID}
        return JsonResponse(response_data)
    except MyUser.DoesNotExist:
        response_data = {"error": "User not found"}
        return JsonResponse(response_data, status=404)


def get_user_details(request, userid):
    try:
        user = MyUser.objects.get(id=userid)
        return JsonResponse(
            {
                "user_type": user.user_type,
                "userID": user.id,
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}",
            }
        )
    except MyUser.DoesNotExist:
        response_data = {"error": "User not found"}
        return JsonResponse(response_data, status=404)


def error_response(error_dict, err_msg: str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg

    return JsonResponse(error_dict)


@csrf_exempt
def search_users(request):
    response_dict = {}
    response_dict["user_data"] = []
    response_dict["total_user_count"] = 0
    try:
        studentprofiles = StudentAlumniProfile.objects.all()
        companyprofiles = CompanyProfile.objects.all()
        result = [prof.previous_employer for prof in studentprofiles]
        result.extend([comp.name for comp in companyprofiles])
        response_dict["prev_comp_options"] = list(set(result))
        response_dict["job_pref_options"] = list(
            set([prof.job_preference for prof in studentprofiles])
        )

        users = MyUser.objects.all()

        user_name, key, company, job_pref = (
            request.GET.get("user_name"),
            request.GET.get("key"),
            request.GET.get("company"),
            request.GET.get("job_pref"),
        )
        cur_page, single_page_count = request.GET.get("cur_page"), request.GET.get(
            "single_page_count"
        )
        if user_name:
            users = users.filter(
                Q(first_name__icontains=user_name) | Q(last_name__icontains=user_name)
            )
        if key:
            studentprofiles = studentprofiles.filter(
                Q(email__icontains=key)
                | Q(job_preference__icontains=key)
                | Q(previous_employer__icontains=key)
                | Q(linkedin_link__icontains=key)
                | Q(github_link__icontains=key)
                | Q(user_summary__icontains=key)
                | Q(degree_subject__icontains=key)
                | Q(highest_degree__icontains=key)
            )
            companyprofiles = companyprofiles.filter(
                Q(email__icontains=key)
                | Q(name__icontains=key)
                | Q(website__icontains=key)
                | Q(description__icontains=key)
            )
            result = [prof.email for prof in studentprofiles]
            result.extend([comp.email for comp in companyprofiles])
            users = users.filter(email__in=result)
        if company:
            studentprofiles = studentprofiles.filter(previous_employer=company)
            companyprofiles = companyprofiles.filter(name=company)
            result = [prof.email for prof in studentprofiles]
            result.extend([comp.email for comp in companyprofiles])
            users = users.filter(email__in=result)
        if job_pref:
            studentprofiles = studentprofiles.filter(job_preference=job_pref).values(
                "email"
            )
            users = users.filter(email__in=studentprofiles)

        response_dict["total_user_count"] = users.count()

        if cur_page and single_page_count:
            if not cur_page.isdigit() or not single_page_count.isdigit():
                response_dict["total_user_count"] = 0
                return error_response(
                    response_dict, "Error: Pagination params not valid!"
                )
            cur_page, single_page_count = int(cur_page), int(single_page_count)
            paginator = Paginator(users, single_page_count)
            users = paginator.page(cur_page).object_list

        response_dict["user_data"] = json.loads(serializers.serialize("json", users))
        response_dict["error_msg"] = ""
        response_dict["status"] = 200
        return JsonResponse(response_dict)
    except Exception as e:
        return error_response(
            response_dict,
            f"Error: Something went wrong! Please try again later! => {e}",
        )


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
