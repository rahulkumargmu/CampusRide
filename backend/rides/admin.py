from django.contrib import admin
from .models import RideRequest, RideOffer, CompletedRide


@admin.register(RideRequest)
class RideRequestAdmin(admin.ModelAdmin):
    list_display = ("rider", "pickup_city", "dropoff_city", "distance_miles", "status", "created_at")
    list_filter = ("status",)


@admin.register(RideOffer)
class RideOfferAdmin(admin.ModelAdmin):
    list_display = ("driver", "ride_request", "price", "status", "created_at")
    list_filter = ("status",)


@admin.register(CompletedRide)
class CompletedRideAdmin(admin.ModelAdmin):
    list_display = ("rider", "driver", "final_price", "distance_miles", "created_at")
