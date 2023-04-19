from rest_framework import generics
from .models import StudentAlumniProfile, CompanyProfile
from .serializers import StudentAlumniProfileSerializer, CompanySerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status


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

    def update(self, request, *args, **kwargs):
        email = kwargs.get("email")
        try:
            instance = self.queryset.get(email=email)
            serializer = self.get_serializer(instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except StudentAlumniProfile.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt  # This is added to disable CSRF protection for demonstration purposes, you should add proper CSRF protection in production
def company_profile(request, email):
    try:
        company = CompanyProfile.objects.get(email=email)
        response_data = {
            "email": company.email,
            "name": company.name,
            "website": company.website,
            "description": company.description,
        }
        return JsonResponse(response_data)
    except StudentAlumniProfile.DoesNotExist:
        # Handle case where the email does not exist in the model
        return JsonResponse(
            {"error": "Company/Recruiter Profile not found"}, status=404
        )


class CompanyProfileCreate(generics.UpdateAPIView):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanySerializer
    lookup_field = "email"
    lookup_url_kwarg = "email"

    def update(self, request, *args, **kwargs):
        email = kwargs.get("email")
        try:
            instance = self.queryset.get(email=email)
            serializer = self.get_serializer(instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CompanyProfile.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
