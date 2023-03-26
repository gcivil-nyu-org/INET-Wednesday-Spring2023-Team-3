from rest_framework import serializers
from .models import StudentAlumniProfile, CompanyProfile


class StudentAlumniProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAlumniProfile()
        fields = [
            "id",
            "job_preference",
            "years_of_experience",
            "previous_employer",
            "linkedin_link",
            "github_link",
        ]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = "__all__"
