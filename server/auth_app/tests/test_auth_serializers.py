from ..serializers import UserSerializer, UserSignUpSerializer, UserLogInSerializer
from ..models import CustomUser
from datetime import datetime
from django.test import RequestFactory, TestCase
from datetime import timedelta
import jwt
from ..serializers import ph

class UserSignUpSerializerTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            username="taken",
            email="taken@taken.com",
            password="pass",
            date_joined=datetime.now()
        )
         
    def test_valid_registration(self):
        data = {
            "username": "newuser",
            "email": "new@new.com",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, "newuser")
        self.assertEqual(user.email, "new@new.com")
    
    def test_email_taken(self):
        data = {
            "username": "newuser",
            "email": "taken@taken.com",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors['email'][0]), "custom user with this email already exists."
        )

    def test_username_taken(self):
        data = {
            "username": "taken",
            "email": "new@new.com",
            "password": "pass",
        }
        serializer = UserSignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors['username'][0]), "custom user with this username already exists."
        )

class UserLogInSerializerTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="user",
            email="user@user.com",
            password=ph.hash("test"),
            date_joined=datetime.now()
        )
    
    def test_invalid_user(self):
        data = {
            "email": "doIexist@gmail.com",
            "password": "no",
        }
        serializer = UserLogInSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors['user']), "User not found"
        )

    def test_invalid_password(self):
        data = {
            "email": "user@user.com",
            "password": "no",
        }
        serializer = UserLogInSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            str(serializer.errors['password'][0]), "Invalid password"
        )

class UserSerializerTest(TestCase):
    
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="user",
            email="user@user.com",
            password="test123",
            date_joined=datetime.now()
        )

    def test_valid_user(self):
        user_serializer = UserSerializer(self.user)
        user_data = user_serializer.data
        self.assertEqual(user_data['username'], 'user')
        self.assertEqual(user_data['email'], 'user@user.com')


