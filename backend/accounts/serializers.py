from rest_framework import serializers
from .models import User, DriverProfile, RiderProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    vehicle_make = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    vehicle_model = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    vehicle_year = serializers.IntegerField(write_only=True, required=False, allow_null=True, default=None)
    vehicle_color = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")
    license_plate = serializers.CharField(write_only=True, required=False, allow_blank=True, default="")

    class Meta:
        model = User
        fields = [
            "email", "full_name", "phone_number", "role", "password", "password_confirm",
            "vehicle_make", "vehicle_model", "vehicle_year", "vehicle_color", "license_plate",
        ]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        if data["role"] not in ["driver", "rider"]:
            raise serializers.ValidationError({"role": "Must be driver or rider"})
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        vehicle_make = validated_data.pop("vehicle_make", "")
        vehicle_model = validated_data.pop("vehicle_model", "")
        vehicle_year = validated_data.pop("vehicle_year", None)
        vehicle_color = validated_data.pop("vehicle_color", "")
        license_plate = validated_data.pop("license_plate", "")

        user = User.objects.create_user(**validated_data)
        if user.role == "driver":
            DriverProfile.objects.create(
                user=user,
                vehicle_make=vehicle_make,
                vehicle_model=vehicle_model,
                vehicle_year=vehicle_year,
                vehicle_color=vehicle_color,
                license_plate=license_plate,
            )
        elif user.role == "rider":
            RiderProfile.objects.create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "phone_number", "role", "is_online", "is_active", "created_at"]


class UpdateProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False, allow_blank=True)
    password_confirm = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["full_name", "phone_number", "password", "password_confirm"]

    def validate(self, data):
        pw = data.get("password", "")
        pw_confirm = data.get("password_confirm", "")
        if pw or pw_confirm:
            if pw != pw_confirm:
                raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        return data

    def update(self, instance, validated_data):
        password = validated_data.pop("password", "")
        validated_data.pop("password_confirm", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DriverProfile
        fields = "__all__"


class RiderProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RiderProfile
        fields = "__all__"
