from rest_framework import serializers
from .models import CustomUser
from datetime import datetime
import os
import argon2
import base64

class UserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'password']


    def validate(self, attrs):
        email = attrs.get('email', '')
        if not "@" in email:
            raise serializers.ValidationError("Invalid email")
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already occupied")

        username = attrs.get('name', '')
        if CustomUser.objects.filter(name=username).exists():
            raise serializers.ValidationError("Username occupied")

        return attrs

    def create(self, validated_data):
        name = validated_data['name']
        email = validated_data['email']
        salt = os.urandom(32)
        password = argon2.hash_password(salt+validated_data['password'].encode('utf-8'))
        date_joined = datetime.now()

        user = CustomUser.objects.create(
            name = name,
            email = email,
            salt = base64.urlsafe_b64encode(salt).decode('utf-8'),
            password = password,
            date_joined = date_joined
        )
        user.save()
        return user

class UserLogInSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']

    def valdiate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
           raise serializers.ValidationError('Email and password are required.', status=400)

        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError("User not found", status=400)

        if argon2.hash_password(base64.urlsafe_b64decode(user.salt) + password.encode('utf-8')) != user.password:
            raise serializers.ValidationError("Invaid Password", status=400)

        return None