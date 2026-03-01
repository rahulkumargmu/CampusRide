from rest_framework import serializers
from .models import RideRequest, RideOffer, CompletedRide
from accounts.serializers import UserSerializer


class RideRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideRequest
        fields = [
            "pickup_city", "pickup_state", "pickup_lat", "pickup_lng",
            "dropoff_city", "dropoff_state", "dropoff_lat", "dropoff_lng",
            "time_type", "requested_time", "time_range_start", "time_range_end",
        ]


class RideRequestSerializer(serializers.ModelSerializer):
    rider = UserSerializer(read_only=True)
    offers_count = serializers.SerializerMethodField()

    class Meta:
        model = RideRequest
        fields = "__all__"

    def get_offers_count(self, obj):
        return obj.offers.count()


class RideOfferCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideOffer
        fields = ["ride_request", "price", "estimated_arrival_minutes", "message"]


class RideOfferSerializer(serializers.ModelSerializer):
    driver = UserSerializer(read_only=True)
    driver_vehicle = serializers.SerializerMethodField()
    driver_rating = serializers.SerializerMethodField()

    class Meta:
        model = RideOffer
        fields = "__all__"

    def get_driver_vehicle(self, obj):
        profile = getattr(obj.driver, "driver_profile", None)
        if profile:
            parts = [profile.vehicle_color, str(profile.vehicle_year or ""), profile.vehicle_make, profile.vehicle_model]
            return " ".join(p for p in parts if p).strip()
        return ""

    def get_driver_rating(self, obj):
        profile = getattr(obj.driver, "driver_profile", None)
        return float(profile.rating) if profile else 5.0


class RideRequestBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideRequest
        fields = ["id", "pickup_city", "pickup_state", "dropoff_city", "dropoff_state", "status"]


class CompletedRideSerializer(serializers.ModelSerializer):
    driver = UserSerializer(read_only=True)
    rider = UserSerializer(read_only=True)
    ride_request = RideRequestBriefSerializer(read_only=True)
    is_completed = serializers.SerializerMethodField()
    driver_vehicle = serializers.SerializerMethodField()

    class Meta:
        model = CompletedRide
        fields = "__all__"

    def get_is_completed(self, obj):
        return obj.dropoff_time is not None

    def get_driver_vehicle(self, obj):
        profile = getattr(obj.driver, "driver_profile", None)
        if profile:
            parts = [profile.vehicle_color, str(profile.vehicle_year or ""), profile.vehicle_make, profile.vehicle_model]
            return " ".join(p for p in parts if p).strip()
        return ""
