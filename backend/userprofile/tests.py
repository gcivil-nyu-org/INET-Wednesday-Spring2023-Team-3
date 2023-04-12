# Test Cases
from django.test import TestCase
from .models import StudentAlumniProfile
from .serializers import StudentAlumniProfileSerializer
from userprofile.models import CompanyProfile


class StudentAlumniProfileTestCase(TestCase):
    def setUp(self):
        # Create a test instance of StudentAlumniProfile model
        self.profile_data = {
            "email": "test@example.com",
            "job_preference": "Software Developer",
            "years_of_experience": 2,
            "previous_employer": "ABC Corp",
            "linkedin_link": "https://www.linkedin.com/in/testuser/",
            "github_link": "https://github.com/testuser/",
        }
        self.profile = StudentAlumniProfile.objects.create(**self.profile_data)

    def test_student_alumni_profile_model(self):
        # Test the model fields
        self.assertEqual(self.profile.email, self.profile_data["email"])
        self.assertEqual(
            self.profile.job_preference, self.profile_data["job_preference"]
        )
        self.assertEqual(
            self.profile.years_of_experience, self.profile_data["years_of_experience"]
        )
        self.assertEqual(
            self.profile.previous_employer, self.profile_data["previous_employer"]
        )
        self.assertEqual(self.profile.linkedin_link, self.profile_data["linkedin_link"])
        self.assertEqual(self.profile.github_link, self.profile_data["github_link"])

    def test_student_alumni_profile_serializer(self):
        # Test the serializer data
        serializer = StudentAlumniProfileSerializer(self.profile)
        self.assertEqual(serializer.data["email"], self.profile_data["email"])
        self.assertEqual(
            serializer.data["job_preference"], self.profile_data["job_preference"]
        )
        self.assertEqual(
            serializer.data["years_of_experience"],
            self.profile_data["years_of_experience"],
        )
        self.assertEqual(
            serializer.data["previous_employer"], self.profile_data["previous_employer"]
        )
        self.assertEqual(
            serializer.data["linkedin_link"], self.profile_data["linkedin_link"]
        )
        self.assertEqual(
            serializer.data["github_link"], self.profile_data["github_link"]
        )


class CompanyProfileTestCase(TestCase):
    def setUp(self):
        # Create a CompanyProfile object for testing
        self.company = CompanyProfile.objects.create(
            name="Example Company",
            website="https://www.example.com",
            description="This is an example company.",
        )

    def test_company_profile_creation(self):
        # Test that a CompanyProfile object was created successfully
        self.assertIsInstance(self.company, CompanyProfile)
        self.assertEqual(CompanyProfile.objects.count(), 1)

    def test_company_profile_attributes(self):
        # Test that the CompanyProfile object has the correct attributes
        self.assertEqual(self.company.name, "Example Company")
        self.assertEqual(self.company.website, "https://www.example.com")
        self.assertEqual(self.company.description, "This is an example company.")
