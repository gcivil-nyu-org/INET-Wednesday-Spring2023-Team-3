from rest_framework import serializers
from .models import Todo
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


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
    )

    class Meta:
        model = get_user_model()
        fields = ["email", "username", "password"]

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
