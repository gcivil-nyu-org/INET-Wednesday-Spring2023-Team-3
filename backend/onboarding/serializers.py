from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

<<<<<<< HEAD:backend/nyuapp/serializers.py

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "title",
            "description",
        )
        model = Todo


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=100, min_length=8, style={"input_type": "password"}
=======
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token["username"] = user.username
        return token


# Serializer to Register User
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
>>>>>>> 4005745b (1) Modularizing nyuapp into onbarding & questions):backend/onboarding/serializers.py
    )

    class Meta:
<<<<<<< HEAD:backend/nyuapp/serializers.py
        model = get_user_model()
        fields = ["email", "username", "password"]
=======
        model = User
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        email = attrs["email"]
        email_exists = User.objects.filter(email=email)
        accepted_domains = ["nyu.edu"]
        _, domain = email.split("@")
        if email_exists.exists() and not self.instance and self.instance.pk == None:
            raise serializers.ValidationError("Email is taken")
        if domain.lower() not in accepted_domains:
            raise serializers.ValidationError("Email should be nyu.edu only.")
        return attrs
>>>>>>> 4005745b (1) Modularizing nyuapp into onbarding & questions):backend/onboarding/serializers.py

    def create(self, validated_data):
        user_password = validated_data.get("password", None)
        db_instance = self.Meta.model(
            email=validated_data.get("email"), username=validated_data.get("username")
        )
        db_instance.set_password(user_password)
        db_instance.save()
        return db_instance


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=100)
    username = serializers.CharField(max_length=100, read_only=True)
    password = serializers.CharField(
        max_length=100, min_length=8, style={"input_type": "password"}
    )
    token = serializers.CharField(max_length=255, read_only=True)
