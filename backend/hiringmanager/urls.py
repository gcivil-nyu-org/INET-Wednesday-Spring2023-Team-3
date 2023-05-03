from django.urls import path
from . import views

urlpatterns = [
    path(
        "refresh_user_metadata",
        views.refresh_user_metadata,
        name="refresh_user_metadata",
    ),
    path(
        "fetch_latest_aggregated_user_data",
        views.fetch_latest_aggregated_user_data,
        name="fetch_latest_aggregated_user_data",
    ),
]
