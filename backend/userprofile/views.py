from rest_framework import generics
from .models import StudentAlumniProfile, CompanyProfile
from .serializers import StudentAlumniProfileSerializer, CompanySerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt  # This is added to disable CSRF protection for demonstration purposes, you should add proper CSRF protection in production
def get_student_alumni_profile(request, email):
    try:
        student_alumni_profile = StudentAlumniProfile.objects.get(email=email)
        # Retrieve data from the model and prepare a JSON response
        response_data = {
            "email": student_alumni_profile.email,
            "job_preference": student_alumni_profile.job_preference,
            "years_of_experience": student_alumni_profile.years_of_experience,
            "previous_employer": student_alumni_profile.previous_employer,
            "linkedin_link": student_alumni_profile.linkedin_link,
            "github_link": student_alumni_profile.github_link,
        }
        return JsonResponse(response_data)
    except StudentAlumniProfile.DoesNotExist:
        # Handle case where the email does not exist in the model
        return JsonResponse({"error": "Student Alumni Profile not found"}, status=404)


class StudentAlumniProfileCreateView(generics.UpdateAPIView):
    queryset = StudentAlumniProfile.objects.all()
    serializer_class = StudentAlumniProfileSerializer
    lookup_field = "email"
    lookup_url_kwarg = "email"


class CompanyProfileCreate(generics.ListCreateAPIView):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanySerializer
