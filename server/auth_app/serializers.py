from rest_framework import serializers
from .models import CustomUser
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
import os
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from dotenv import load_dotenv
from pathlib import Path
import os
from authlib.integrations.requests_client import OAuth2Session

ph = PasswordHasher()

class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

    def get_id(self, obj):
        return str(obj.id) 

class UserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

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

        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError({'user': "User not found"})

        try:
            ph.verify(user.password, password)
        except VerifyMismatchError:
            raise serializers.ValidationError({'password': "Invalid password"})

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

class UserAuthSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get('token')
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user = CustomUser.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found')

        user_data = UserSerializer(user).data
        return user_data


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
GOOGLE_CLIENT_ID = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
GOOGLE_CLIENT_SECRET = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET')
REDIRECT_URI = 'http://localhost:8000/authenticatation/google/callback/'
class GoogleAuthInitSerializer(serializers.Serializer):
    def create(self, validated_data):
        session = OAuth2Session(GOOGLE_CLIENT_ID, scope='openid email profile')
        uri, state = session.create_authorization_url(
            'https://accounts.google.com/o/oauth2/auth',
            redirect_uri=REDIRECT_URI
        )
        return {"auth_url": uri, "state": state}


class GoogleAuthCallbackSerializer(serializers.Serializer):
    code = serializers.CharField()
    state = serializers.CharField()

    def create(self, validated_data):
        session = OAuth2Session(
            GOOGLE_CLIENT_ID,
            state=validated_data['state'],
            redirect_uri=REDIRECT_URI
        )

        token = session.fetch_token(
            'https://oauth2.googleapis.com/token',
            code=validated_data['code'],
            client_secret=GOOGLE_CLIENT_SECRET,
            auth=None,
        )

        userinfo = session.get('https://www.googleapis.com/oauth2/v1/userinfo').json()

        user, created = CustomUser.objects.get_or_create(
            username=userinfo["email"],
            email=userinfo['email'],
            date_joined=datetime.now()
        )
        user.set_unusable_password()
        payload = {
            'id': str(user.id),
            'exp': datetime.now() + timedelta(minutes=60),
            'iat': datetime.now()
        }
        jwttoken = jwt.encode(payload, 'secret', algorithm='HS256')
        
        return {
            "email": user.email,
            "id": str(user.id),
            "token": jwttoken,
            "created": created
        }