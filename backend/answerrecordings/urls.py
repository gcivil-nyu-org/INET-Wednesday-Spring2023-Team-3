from rest_framework.routers import SimpleRouter
from .views import DropBoxViewset
from django.urls import path
from . import views

router = SimpleRouter()
router.register("answerrecording", DropBoxViewset)
urlpatterns = router.urls

urlpatterns += (
    path(
        "list_answers_for_ques/<int:q_id>",
        views.list_answers_for_ques,
        name="list_answers_for_ques",
    ),
)
