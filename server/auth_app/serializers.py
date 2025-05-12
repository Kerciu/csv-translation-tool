from rest_framework import serializers
from .models import CustomUser
from datetime import datetime, timedelta
from rest_framework.response import Response
import jwt
import os
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import base64

ph = PasswordHasher()

class UserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def validate(self, attrs):
        email = attrs.get('email', '')
        if "@" not in email:
            raise serializers.ValidationError("Invalid email")
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already occupied")

        username = attrs.get('username', '')
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username occupied")

        return attrs

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        raw_password = validated_data['password']

        hashed_password = ph.hash(raw_password)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=hashed_password,
            date_joined=datetime.now()
        )
        return user


class UserLogInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')

        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError("User not found")

        try:
            ph.verify(user.password, password)
        except VerifyMismatchError:
            raise serializers.ValidationError("Invalid password")

        if ph.check_needs_rehash(user.password):
            user.password = ph.hash(password)
            user.save()

        payload = {
            'id': str(user.id),
            'exp': datetime.now() + timedelta(minutes=60),
            'iat': datetime.now()
        }
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        attrs['token'] = token
        return attrs
