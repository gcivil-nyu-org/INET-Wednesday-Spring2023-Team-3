from .models import QuestionStarterCode, QuestionSubmissionCode
from questions.models import Question
from onboarding.models import MyUser
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.core import serializers
from json import JSONDecodeError
import requests
import os


def error_response(error_dict, err_msg: str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg

    return JsonResponse(error_dict)


def get_starter_code(request):
    response_dict = {}

    param_names = [
        "user",
        "language",
        "question",
    ]
    params = request.GET
    param_vals = [params.get(key) for key in param_names]

    if not param_vals[2]:
        return error_response(response_dict, "Error: Question not entered!")
    try:
        question = int(param_vals[2])
    except Exception as e:
        return error_response(response_dict, f"Error: Unable to parse question_id! {e}")
    if param_vals[0] and param_vals[1]:
        try:
            user_submission = QuestionSubmissionCode.objects.filter(
                user=int(param_vals[0]), language=param_vals[1], question=question
            )

            if not user_submission.count():
                starter_code = QuestionStarterCode.objects.get(
                    question=question, language=param_vals[1]
                )
                response_dict["starter_code"] = starter_code.sc_text
            else:
                response_dict["starter_code"] = user_submission.first().sub_text

            response_dict["error_msg"] = ""
            response_dict["status"] = 200
            return JsonResponse(response_dict)

        except Exception as e:
            response_dict["starter_code"] = ""
            return error_response(response_dict, f"Error: Something went wrong!: {e}")

    return error_response(response_dict, "Error: Enter user and language fields!")


@csrf_exempt
def post_coding_answer(request):
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
        user, question, submission, language = (
            req_body["user"],
            req_body["question"],
            req_body["submission"],
            req_body["language"],
        )
    except KeyError as e:
        return error_response(
            {}, f"Error: Invalid request body. Key not passed : => {e}!"
        )
    print("CodingAnswer passed :", user, question, submission, language)

    try:
        obj, created = QuestionSubmissionCode.objects.get_or_create(
            user=MyUser.objects.get(id=user),
            question=Question.objects.get(q_id=question),
            sub_text=submission,
            language=language,
        )
        if not created:
            return error_response({}, "Error in uploading answer to DB")
    except Exception as e:
        return error_response({}, f"Error in uploading answer to DB: {e}")

    return JsonResponse(
        {
            "status": 200,
            "error_msg": "",
            "inserted_question": json.loads(
                serializers.serialize(
                    "json",
                    [
                        obj,
                    ],
                )
            ),
        }
    )


@csrf_exempt
def submission(request):
    if request.method == "POST":
        try:
            req_body = json.loads(request.body)
            code = req_body.get("script")
            language = req_body.get("language")
            version_index = req_body.get("versionIndex")

            input_params = {
                "clientId": os.environ.get("MakendyClientID"),
                "clientSecret": os.environ.get("MakendyClientSecret"),
                "script": code,
                "language": language,
                "versionIndex": version_index,
            }

            response = requests.post(
                "https://api.jdoodle.com/v1/execute", json=input_params
            )
            data = json.loads(response.text)

            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
