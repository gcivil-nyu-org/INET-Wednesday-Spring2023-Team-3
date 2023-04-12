from django.urls import path
from .views import (
    StudentAlumniProfileCreateView,
    CompanyProfileCreate,
    get_student_alumni_profile,
)


urlpatterns = [
    path(
        "nyu-profile/",
        StudentAlumniProfileCreateView.as_view(),
        name="student_alumni_profile",
    ),
    path(
        "companies-profile/",
        CompanyProfileCreate.as_view(),
        name="company_recruiter_profile",
    ),
    path(
        "profile-info/<str:email>/",
        get_student_alumni_profile,
        name="get_student_alumni_profile",
    ),
]
