from django.urls import path
from . import views

urlpatterns = [
    path("get_user_type/<str:email>/", views.get_user_type, name="get_user_type"),
    path(
        "get_user_details/<int:userid>/",
        views.get_user_details,
        name="get_user_details",
    ),
    path("add-friend/", views.add_friend, name="add-friend"),
    path("remove-friend/", views.remove_friend, name="remove-friend"),
    path("friends-list/<int:user_id>/", views.friends_list, name="friends-list"),
    path("search-users/", views.search_users, name="search-users"),
]
