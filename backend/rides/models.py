import uuid
from django.db import models
from django.conf import settings


class RideRequest(models.Model):
    class TimeType(models.TextChoices):
        IMMEDIATE = "immediate", "Right Now"
        SPECIFIC = "specific", "Specific Time"
        RANGE = "range", "Time Range"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        OFFERED = "offered", "Offers Received"
        ACCEPTED = "accepted", "Accepted"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ride_requests")

    pickup_city = models.CharField(max_length=100)
    pickup_state = models.CharField(max_length=2)
    pickup_lat = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_lng = models.DecimalField(max_digits=9, decimal_places=6)

    dropoff_city = models.CharField(max_length=100)
    dropoff_state = models.CharField(max_length=2)
    dropoff_lat = models.DecimalField(max_digits=9, decimal_places=6)
    dropoff_lng = models.DecimalField(max_digits=9, decimal_places=6)

    distance_miles = models.DecimalField(max_digits=8, decimal_places=2)
    suggested_price = models.DecimalField(max_digits=8, decimal_places=2)

    time_type = models.CharField(max_length=10, choices=TimeType.choices)
    requested_time = models.DateTimeField(null=True, blank=True)
    time_range_start = models.DateTimeField(null=True, blank=True)
    time_range_end = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    accepted_offer = models.ForeignKey(
        "RideOffer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="accepted_for_request",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ride_requests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Ride: {self.pickup_city} -> {self.dropoff_city} ({self.status})"


class RideOffer(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        WITHDRAWN = "withdrawn", "Withdrawn"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ride_request = models.ForeignKey(RideRequest, on_delete=models.CASCADE, related_name="offers")
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ride_offers")

    price = models.DecimalField(max_digits=8, decimal_places=2)
    estimated_arrival_minutes = models.PositiveIntegerField(default=0)
    message = models.CharField(max_length=200, blank=True)

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ride_offers"
        ordering = ["price"]
        unique_together = ["ride_request", "driver"]

    def __str__(self):
        return f"Offer: ${self.price} by {self.driver.full_name}"


class CompletedRide(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ride_request = models.OneToOneField(RideRequest, on_delete=models.CASCADE, related_name="completed_ride")
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="completed_drives")
    rider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="completed_rides")

    final_price = models.DecimalField(max_digits=8, decimal_places=2)
    distance_miles = models.DecimalField(max_digits=8, decimal_places=2)

    pickup_time = models.DateTimeField(null=True, blank=True)
    dropoff_time = models.DateTimeField(null=True, blank=True)

    driver_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    rider_rating = models.PositiveSmallIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "completed_rides"
        ordering = ["-created_at"]
