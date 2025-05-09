from rest_framework import serializers
from .models import CustomUser

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'salt', 'password', 'date_joined']


    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        salt = validated_data['salt']
        password = validated_data['password']
        date_joined = validated_data['date_joined']

        user = CustomUser.objects.create(
            username = username,
            email = email,
            salt = salt,
            password = password,
            date_joined = date_joined
        )
        user.save()
        return user