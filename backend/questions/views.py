from django.core.paginator import Paginator
from .models import Question, Difficulty, Company, Position
from django.http import JsonResponse
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt
from json import JSONDecodeError


def error_response(error_dict, err_msg: str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg

    return JsonResponse(error_dict)


def get_questions(request):
    response_dict = {}
    response_dict["question_data"] = []
    response_dict["total_question_count"] = 0
    try:
        difficulties = Difficulty.objects.all()
        response_dict["difficulties"] = [diff.pk for diff in difficulties]
        companies = Company.objects.all()
        response_dict["companies"] = [company.pk for company in companies]
        positions = Position.objects.all()
        response_dict["positions"] = [position.pk for position in positions]
        questions = Question.objects.all()
        param_names = [
            "difficulty",
            "type",
            "company",
            "title",
            "position",
            "q_id",
            "cur_page",
            "single_page_count",
        ]
        params = request.GET
        param_vals = [params.get(key) for key in param_names]
        if param_vals[0]:
            difficulties = difficulties.filter(text=param_vals[0])
            if not difficulties.count():
                return error_response(
                    response_dict,
                    "Error: Difficulty not found. Enter a valid difficulty level!",
                )
            questions = questions.filter(difficulty=param_vals[0])
        if param_vals[1]:
            questions = questions.filter(type=param_vals[1])
        if param_vals[2]:
            companies = companies.filter(name=param_vals[2])
            if not companies.count():
                return error_response(response_dict, "Error: Company not found!")
            questions = questions.filter(companies__icontains=param_vals[2])
        if param_vals[3]:
            questions = questions.filter(title__icontains=param_vals[3])
        if param_vals[4]:
            positions = positions.filter(name=param_vals[4])
            if not positions.count():
                return error_response(response_dict, "Error: Position not found!")
            questions = questions.filter(positions__icontains=param_vals[4])
        if param_vals[5]:
            questions = questions.filter(q_id=param_vals[5])
        response_dict["total_question_count"] = questions.count()
        if param_vals[6] and param_vals[7]:
            if not param_vals[6].isdigit() or not param_vals[7].isdigit():
                response_dict["total_question_count"] = 0
                return error_response(
                    response_dict, "Error: Pagination params not valid!"
                )
            cur_page, single_page_count = int(param_vals[6]), int(param_vals[7])
            paginator = Paginator(questions, single_page_count)
            questions = paginator.page(cur_page)

        response_dict["question_data"] = json.loads(
            serializers.serialize("json", questions)
        )
        response_dict["error_msg"] = ""
        response_dict["status"] = 200
        return JsonResponse(response_dict)
    except Exception as e:
        return error_response(
            response_dict,
            f"Error: Something went wrong! Please try again later! => {e}",
        )


@csrf_exempt
def post_question(request):
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
        title, description, companies = (
            req_body["title"],
            req_body["description"],
            req_body["companies"],
        )
        categories, difficulty, positions = (
            req_body["categories"],
            req_body["difficulty"],
            req_body["positions"],
        )
        type = req_body["type"]
    except KeyError as e:
        return error_response(
            {}, f"Error: Invalid request body. Key not passed : => {e}!"
        )
    print(
        "Question passed :",
        title,
        description,
        companies,
        categories,
        difficulty,
        positions,
        type,
    )

    try:
        obj, created = Question.objects.get_or_create(
            title=title,
            description=description,
            companies=companies,
            categories=categories,
            difficulty=difficulty,
            positions=positions,
            type=type,
        )
        company_list = companies.replace(" ", "").split(",")
        for company in company_list:
            if not Company.objects.filter(name=company).count():
                Company.objects.get_or_create(name=company)
        difficulty = difficulty.replace(" ", "")
        if not Difficulty.objects.filter(text=difficulty).count():
            Difficulty.objects.get_or_create(text=difficulty)
        position_list = positions.replace(" ", "").split(",")
        for position in position_list:
            if not Position.objects.filter(name=position).count():
                Position.objects.get_or_create(name=position)

        if not created:
            return error_response({}, "Error in uploading question to DB")
    except Exception:
        return error_response({}, "Error in uploading question to DB")
    #     if not created:
    #         return error_response({}, f"Error in uploading question to DB")
    # except Exception as e:
    #     return error_response({}, f"Error in uploading question to DB")

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
