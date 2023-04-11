from rest_framework import generics
from .models import StudentAlumniProfile, CompanyProfile
from .serializers import StudentAlumniProfileSerializer, CompanySerializer


class StudentAlumniProfileCreateView(generics.ListCreateAPIView):
    queryset = StudentAlumniProfile.objects.all()
    serializer_class = StudentAlumniProfileSerializer


class CompanyProfileCreate(generics.ListCreateAPIView):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanySerializer
