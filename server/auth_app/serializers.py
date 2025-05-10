import os
from datetime import datetime

import argon2
from rest_framework import serializers

from .models import CustomUser


class UserSignUpSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    password = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "password"]

    def validate(self, attrs):
        email = attrs.get("email", "")
        if "@" not in email:
            raise serializers.ValidationError("Invalid email")
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already occupied")

        username = attrs.get("username", "")
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username occupied")

        return attrs

    def create(self, validated_data):
        username = validated_data["username"]
        email = validated_data["email"]
        salt = os.urandom(32)
        password = argon2.hash_password(salt + validated_data["password"])
        date_joined = datetime.now()

        user = CustomUser.objects.create(
            username=username,
            email=email,
            salt=salt,
            password=password,
            date_joined=date_joined,
        )
        user.save()
        return user
