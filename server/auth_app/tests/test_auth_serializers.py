from ..serializers import UserSerializer
from ..models import CustomUser
from datetime import datetime
from django.test import RequestFactory, TestCase

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
        self.assertTrue(user_data['username'], 'user')
        self.assertTrue(user_data['email'], 'user@user.com')


