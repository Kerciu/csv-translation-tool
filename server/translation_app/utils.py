from auth_app.serializers import UserAuthSerializer
from rest_framework import status
from rest_framework.response import Response


class JWTUserAuthentication:
    """
    Utils method for using accross serializers
    """

    def get_authenticated_user(self, request):
        """
        Uses from auth_app UserAuthSerializer and authenticates user based on JWT token.
        Return: authenticated user
        """
        serializer = UserAuthSerializer(data={"token": request.COOKIES.get("jwt")})
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return serializer.validated_data
