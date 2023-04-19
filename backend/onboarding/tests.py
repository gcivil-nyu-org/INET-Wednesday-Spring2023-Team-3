from django.test import TestCase, Client
from django.urls import reverse
from .models import MyUser


class MyUserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = MyUser.objects.create_user(
            email="test@example.com",
            password="testpassword",
            user_type="regular",
            first_name="John",
            last_name="Doe",
        )

    def test_get_user_type(self):
        url = reverse("get_user_type", kwargs={"email": self.user.email})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user_type"], self.user.user_type)

    def test_get_user_type_user_not_found(self):
        url = reverse("get_user_type", kwargs={"email": "nonexistent@example.com"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["error"], "User not found")
