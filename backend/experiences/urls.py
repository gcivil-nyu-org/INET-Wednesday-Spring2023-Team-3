from django.urls import path
from . import views
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register("post_experience", views.ExperienceViewset)

urlpatterns = [
    path(
        "list_experiences",
        views.list_experiences,
        name="list_experiences",
    ),
    path(
        "get_comments/<int:exp_id>",
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
