from rest_framework import serializers
from .models import StudentAlumniProfile, CompanyProfile


class StudentAlumniProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAlumniProfile
        fields = "__all__"
        partial = True


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = "__all__"
        partial = True
