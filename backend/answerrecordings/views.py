from rest_framework import viewsets, parsers
from .models import DropBox, Comment
from .serializers import DropBoxSerializer
from django.http import JsonResponse
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from json import JSONDecodeError


def error_response(error_dict, err_msg: str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg

    return JsonResponse(error_dict)


class DropBoxViewset(viewsets.ModelViewSet):

    queryset = DropBox.objects.all()
    serializer_class = DropBoxSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    http_method_names = ["get", "post", "patch", "delete"]


def list_answers_for_ques(request, q_id):
    response_dict = {}
    answers = DropBox.objects.filter(question=q_id)

    response_dict["answer_data"] = json.loads(serializers.serialize("json", answers))

    response_dict["error_msg"] = ""
    response_dict["status_code"] = 200

    return JsonResponse(response_dict)


def get_comments(request, answer_id):
    response_dict = {}
    comments = Comment.objects.filter(answer=answer_id)

    response_dict["comment_data"] = json.loads(serializers.serialize("json", comments))

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
        rating, answer, text = (
            req_body["rating"],
            req_body["answer"],
            req_body["text"],
        )
    except KeyError as e:
        return error_response(
            {}, f"Error: Invalid request body. Key not passed : => {e}!"
        )
    print(
        "Comment passed :",
        rating,
        answer,
        text,
    )

    try:
        obj, created = Comment.objects.get_or_create(
            rating=rating,
            answer=DropBox.objects.get(ans_id=answer),
            text=text,
        )
        if not created:
            return error_response({}, "Error in uploading comment to DB")
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
