from django.http import JsonResponse
from onboarding.models import MyUser
from experiences.models import Experience, ExperienceComment
from answerrecordings.models import DropBox, Comment
from codinganswers.models import QuestionSubmissionCode
from .models import UserWiseAggregation, Aggregations
from statistics import mean
from django.core import serializers
import json
from django.core.paginator import Paginator


def refresh_user_metadata(request):
    all_users = MyUser.objects.all()
    last_agg = Aggregations.objects.all().first().last_agg_id
    new_agg = last_agg + 1

    for user in all_users:
        try:
            num_exp_posted = Experience.objects.filter(user=user).count()
            num_rec_posted = DropBox.objects.filter(user=user).count()
            num_codes_posted = QuestionSubmissionCode.objects.filter(user=user).count()
            num_expcmnts_posted = ExperienceComment.objects.filter(user=user).count()
            num_anscmnts_posted = Comment.objects.filter(user=user).count()
            num_totalcmnts_posted = num_expcmnts_posted + num_anscmnts_posted

            user_answers = DropBox.objects.filter(user=user)
            ratings = []
            for ans in user_answers:
                comments = Comment.objects.filter(answer=ans)
                for cmnt in comments:
                    ratings.append(cmnt.rating)

            avg_rec_rating_received = mean(ratings) if len(ratings) else 0
            UserWiseAggregation.objects.get_or_create(
                agg_id=new_agg,
                user=user,
                num_exp_posted=num_exp_posted,
                num_rec_posted=num_rec_posted,
                num_codes_posted=num_codes_posted,
                num_totalcmnts_posted=num_totalcmnts_posted,
                num_expcmnts_posted=num_expcmnts_posted,
                num_anscmnts_posted=num_anscmnts_posted,
                avg_rec_rating_received=avg_rec_rating_received,
            )
        except Exception as e:
            return JsonResponse(
                {"status": 400, "agg_status": "failure", "error_msg": f"Error: {e}"}
            )

    Aggregations.objects.update(last_agg_id=new_agg)
    return JsonResponse({"status": 200, "agg_status": "success", "error_msg": ""})


def error_response(error_dict, err_msg: str):
    error_dict["status"] = 400
    error_dict["error_msg"] = err_msg

    return JsonResponse(error_dict)


def fetch_latest_aggregated_user_data(request):
    response_dict = {}
    response_dict["user_data"] = []
    last_agg = Aggregations.objects.all().first().last_agg_id
    last_agg_rows = UserWiseAggregation.objects.filter(agg_id=last_agg)

    params = request.GET
    sort_by, cur_page, single_page_count, user = (
        params.get("sort_by"),
        params.get("cur_page"),
        params.get("single_page_count"),
        params.get("user"),
    )

    if user:
        try:
            user_agg_row = last_agg_rows.filter(user=MyUser.objects.get(id=user))
            response_dict["user_data"] = json.loads(
                serializers.serialize("json", user_agg_row)
            )
            response_dict["status"] = 200
            response_dict["error_msg"] = ""
            return JsonResponse(response_dict)
        except Exception as e:
            return error_response(response_dict, f"Error: {e}")

    response_dict["total_user_count"] = last_agg_rows.count()

    if sort_by and (
        sort_by in [f.name for f in UserWiseAggregation._meta.get_fields()]
        or sort_by in [f"-{f.name}" for f in UserWiseAggregation._meta.get_fields()]
    ):
        last_agg_rows = last_agg_rows.order_by(sort_by)

    if cur_page and single_page_count:
        if not cur_page.isdigit() or not single_page_count.isdigit():
            response_dict["total_user_count"] = 0
            return error_response(response_dict, "Error: Pagination params not valid!")
        cur_page, single_page_count = int(cur_page), int(single_page_count)
        paginator = Paginator(last_agg_rows, single_page_count)
        last_agg_rows = paginator.page(cur_page).object_list

    response_dict["status"] = 200
    response_dict["error_msg"] = ""
    response_dict["user_data"] = json.loads(
        serializers.serialize("json", last_agg_rows)
    )

    for i, row in enumerate(last_agg_rows):
        username = f"{row.user.first_name} {row.user.last_name}"
        response_dict["user_data"][i]["fields"]["username"] = username
    return JsonResponse(response_dict)
