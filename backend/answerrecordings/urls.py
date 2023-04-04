from rest_framework.routers import SimpleRouter
from .views import DropBoxViewset
from django.urls import path
from . import views

router = SimpleRouter()
router.register("answerrecording", DropBoxViewset)

urlpatterns = [
    path(
        "list_answers_for_ques/<int:q_id>",
        views.list_answers_for_ques,
        name="list_answers_for_ques",
    ),
    path(
        "get_comments/<int:answer_id>",
        views.get_comments,
        name="get_comments",
    ),
    path(
        "post_comment/",
        views.post_comment,
        name="post_comment",
    ),
]

urlpatterns.extend(router.urls)
