from rest_framework import serializers
from .models import CustomUser
from datetime import datetime
import os


class UserSignUpSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']


    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        salt = "salt"
        password = validated_data['password']
        date_joined = datetime.now()

        user = CustomUser.objects.create(
            username = username,
            email = email,
            salt = salt,
            password = password,
            date_joined = date_joined
        )
        user.save()
        return user