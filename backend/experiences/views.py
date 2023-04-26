from .models import Experience, ExperienceComment
from rest_framework import viewsets, parsers
from .serializers import ExperienceSerializer
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from json import JSONDecodeError
from django.core import serializers
from onboarding.models import MyUser
from django.core.paginator import Paginator


class ExperienceViewset(viewsets.ModelViewSet):

    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    http_method_names = ["get", "post", "patch", "delete"]


def error_response(error_dict, err_msg: str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg

    return JsonResponse(error_dict)


def list_experiences(request):
    response_dict = {}
    response_dict["experience_data"] = []
    response_dict["total_experience_count"] = 0

    params = request.GET
    title, cur_page, single_page_count = (
        params.get("title"),
        params.get("cur_page"),
        params.get("single_page_count"),
    )
    if title:
        experiences = Experience.objects.filter(exp_title__icontains=title)
    else:
        experiences = Experience.objects.all()
    response_dict["total_experience_count"] = experiences.count()
    if cur_page and single_page_count:
        if not cur_page.isdigit() or not single_page_count.isdigit():
            response_dict["total_experience_count"] = 0
            return error_response(response_dict, "Error: Pagination params not valid!")
        cur_page, single_page_count = int(cur_page), int(single_page_count)
        paginator = Paginator(experiences, single_page_count)
        experiences = paginator.page(cur_page).object_list
    response_dict["experience_data"] = json.loads(
        serializers.serialize("json", experiences)
    )
    for i, experience in enumerate(experiences):
        username = f"{experience.user.first_name} {experience.user.last_name}"
        response_dict["experience_data"][i]["fields"]["username"] = username
    response_dict["error_msg"] = ""
    response_dict["status"] = 200
    return JsonResponse(response_dict)


def get_comments(request, exp_id):
    response_dict = {}
    comments = ExperienceComment.objects.filter(experience=exp_id)

    response_dict["comment_data"] = json.loads(serializers.serialize("json", comments))
    for i, comment in enumerate(comments):
        username = f"{comment.user.first_name} {comment.user.last_name}"
        response_dict["comment_data"][i]["fields"]["username"] = username

    response_dict["error_msg"] = ""
    response_dict["status_code"] = 200

    return JsonResponse(response_dict)


@csrf_exempt
def post_comment(request):
    if request.method != "POST":
        return error_response({}, "Error: Invalid HTTP method!")
    try:
        print(f"Requestbody: {request.body}")
        req_body = json.loads(request.body)
    except JSONDecodeError as e:
        return error_response(
            {}, f"Error: Invalid request body JSONDecodeError => {e}!"
        )
    print(req_body)
    try:
        experience, text, user = (
            req_body["experience"],
            req_body["text"],
            req_body["user"],
        )
    except KeyError as e:
        return error_response(
            {}, f"Error: Invalid request body. Key not passed : => {e}!"
        )
    print(
        "Comment passed :",
        user,
        experience,
        text,
    )

    try:
        obj, _ = ExperienceComment.objects.get_or_create(
            user=MyUser.objects.get(id=user),
            experience=Experience.objects.get(exp_id=experience),
            text=text,
        )
    except Exception as e:
        return error_response({}, f"Error in uploading comment to DB : {e}")

    return JsonResponse(
        {
            "status": 200,
            "error_msg": "",
            "inserted_comment": json.loads(
                serializers.serialize(
                    "json",
                    [
                        obj,
                    ],
                )
            ),
        }
    )
