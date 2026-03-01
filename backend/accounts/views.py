from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView

from .models import User, DriverProfile, FavouriteDriver
from .serializers import RegisterSerializer, UserSerializer, UpdateProfileSerializer, DriverProfileSerializer
from .permissions import IsAdmin, IsRider


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"error": "Account is deactivated"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user.is_online = True
        user.save(update_fields=["is_online"])

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            }
        )


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass

        request.user.is_online = False
        request.user.save(update_fields=["is_online"])
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)


class ProfileView(RetrieveUpdateAPIView):
    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UpdateProfileSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user


class DriverProfileView(RetrieveUpdateAPIView):
    serializer_class = DriverProfileSerializer

    def get_object(self):
        return DriverProfile.objects.get(user=self.request.user)


class TokenRefreshView(BaseTokenRefreshView):
    pass


# Admin views
class AdminUserListView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class AdminCreateUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class AdminDeleteUserView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.is_active = False
            user.save(update_fields=["is_active"])
            return Response({"message": "User deactivated"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminOnlineUsersView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(is_online=True)


class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        from rides.models import RideRequest

        return Response(
            {
                "total_users": User.objects.count(),
                "total_drivers": User.objects.filter(role="driver").count(),
                "total_riders": User.objects.filter(role="rider").count(),
                "online_users": User.objects.filter(is_online=True).count(),
                "active_rides": RideRequest.objects.filter(
                    status__in=["pending", "offered", "accepted", "in_progress"]
                ).count(),
                "completed_rides": RideRequest.objects.filter(status="completed").count(),
            }
        )


class FavouriteDriverView(APIView):
    permission_classes = [IsRider]

    def get(self, request):
        ids = FavouriteDriver.objects.filter(rider=request.user).values_list("driver_id", flat=True)
        return Response([str(i) for i in ids])

    def post(self, request):
        driver_id = request.data.get("driver_id")
        if not driver_id:
            return Response({"error": "driver_id required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            fav, created = FavouriteDriver.objects.get_or_create(
                rider=request.user, driver_id=driver_id
            )
        except Exception:
            return Response({"error": "Invalid driver_id"}, status=status.HTTP_400_BAD_REQUEST)
        if not created:
            fav.delete()
            return Response({"favourited": False})
        return Response({"favourited": True})
