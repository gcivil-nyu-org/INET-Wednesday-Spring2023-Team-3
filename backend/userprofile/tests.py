from django.test import TestCase
from .models import StudentAlumniProfile
from .serializers import StudentAlumniProfileSerializer
from userprofile.models import CompanyProfile
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .serializers import CompanySerializer


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


class CompanyProfileCreateTestCase(APITestCase):
    def setUp(self):
        self.company1 = CompanyProfile.objects.create(
            email="company1@test.com",
            name="Company 1",
            website="https://www.company1.com",
            description="This is company 1",
        )
        self.company2_data = {
            "email": "company2@test.com",
            "name": "Company 2",
            "website": "https://www.company2.com",
            "description": "This is company 2",
        }
        self.company2_serializer = CompanySerializer(instance=self.company2_data)

    def test_update_existing_company_profile(self):
        url = reverse(
            "company_recruiter_profile", kwargs={"email": self.company1.email}
        )
        response = self.client.put(
            url,
            {
                "name": "New Name",
                "website": "https://www.new-website.com",
                "description": "New description",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.company1.refresh_from_db()
        self.assertEqual(self.company1.name, "New Name")
        self.assertEqual(self.company1.website, "https://www.new-website.com")
        self.assertEqual(self.company1.description, "New description")

    def test_create_new_company_profile(self):
        url = reverse(
            "company_recruiter_profile", kwargs={"email": self.company2_data["email"]}
        )
        response = self.client.put(url, self.company2_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            CompanyProfile.objects.filter(email=self.company2_data["email"]).exists()
        )

    def test_create_new_company_profile_with_invalid_data(self):
        url = reverse(
            "company_recruiter_profile", kwargs={"email": self.company2_data["email"]}
        )
        response = self.client.put(
            url,
            {
                "email": "invalid-email",
                "name": "Company 3",
                "website": "https://www.company3.com",
                "description": "This is company 3",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(CompanyProfile.objects.filter(email="invalid-email").exists())


class StudentAlumniProfileCreateViewTestCase(APITestCase):
    def setUp(self):
        self.student1 = StudentAlumniProfile.objects.create(
            email="student1@test.com",
            job_preference="Software Engineer",
            years_of_experience=3,
            previous_employer="Acme Corp",
            linkedin_link="https://www.linkedin.com/in/student1/",
            github_link="https://github.com/student1",
            img_file=None,
        )
        self.valid_payload = {
            "email": "student1@test.com",
            "job_preference": "Product Manager",
            "years_of_experience": 5,
            "previous_employer": "XYZ Corp",
            "linkedin_link": "https://www.linkedin.com/in/student1/",
            "github_link": "https://github.com/student1",
            "img_file": None,
        }
        self.invalid_payload = {
            "email": "student2@test.com",
            "job_preference": "Product Manager",
            "years_of_experience": "5",  # years_of_experience should be an integer
            "previous_employer": "XYZ Corp",
            "linkedin_link": "invalid-linkedin-link",
            "github_link": "https://github.com/student2",
        }

    def test_valid_update_student_profile(self):
        url = reverse("student_alumni_profile", kwargs={"email": self.student1.email})
        response = self.client.put(url, data=self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.valid_payload)

    def test_valid_create_student_profile(self):
        some_valid_payload = {
            "email": "newwhbfehwh@test.com",
            "job_preference": "Product Manager",
            "years_of_experience": 5,
            "previous_employer": "XYZ Corp",
            "linkedin_link": "https://www.linkedin.com/in/student1/",
            "github_link": "https://github.com/student1",
        }
        new_email = "newwhbfehwh@test.com"
        url = reverse("student_alumni_profile", kwargs={"email": new_email})
        response = self.client.put(url, data=some_valid_payload, format="json")
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], new_email)

    def test_invalid_update_student_profile(self):
        url = reverse("student_alumni_profile", kwargs={"email": self.student1.email})
        response = self.client.put(url, data=self.invalid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(set(response.data.keys()), set(["linkedin_link"]))

    def test_invalid_create_student_profile(self):
        url = reverse(
            "student_alumni_profile", kwargs={"email": self.invalid_payload["email"]}
        )
        response = self.client.put(url, data=self.invalid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(set(response.data.keys()), set(["linkedin_link"]))
