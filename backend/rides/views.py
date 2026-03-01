from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

from .models import RideRequest, RideOffer, CompletedRide
from .serializers import (
    RideRequestCreateSerializer,
    RideRequestSerializer,
    RideOfferCreateSerializer,
    RideOfferSerializer,
    CompletedRideSerializer,
)
from .utils import haversine_miles, calculate_suggested_price
from accounts.permissions import IsRider, IsDriver, IsAdmin


class CreateRideRequestView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        serializer = RideRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        distance = haversine_miles(
            data["pickup_lat"], data["pickup_lng"],
            data["dropoff_lat"], data["dropoff_lng"],
        )
        suggested_price = calculate_suggested_price(distance)

        ride_request = RideRequest.objects.create(
            rider=request.user,
            distance_miles=distance,
            suggested_price=suggested_price,
            **data,
        )

        # Broadcast to all available drivers via WebSocket
        channel_layer = get_channel_layer()
        ride_data = RideRequestSerializer(ride_request).data
        async_to_sync(channel_layer.group_send)(
            "drivers_available",
            {
                "type": "new_ride_request",
                "data": ride_data,
            },
        )

        return Response(ride_data, status=status.HTTP_201_CREATED)


class ListRideRequestsView(ListAPIView):
    serializer_class = RideRequestSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "rider":
            return RideRequest.objects.filter(rider=user)
        elif user.role == "driver":
            return RideRequest.objects.filter(status__in=["pending", "offered"])
        elif user.role == "admin":
            return RideRequest.objects.all()
        return RideRequest.objects.none()


class RideRequestDetailView(APIView):
    def get(self, request, pk):
        try:
            ride_request = RideRequest.objects.get(pk=pk)
            return Response(RideRequestSerializer(ride_request).data)
        except RideRequest.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class UpdateRideRequestView(APIView):
    permission_classes = [IsRider]

    def patch(self, request, pk):
        try:
            ride_request = RideRequest.objects.get(pk=pk, rider=request.user)
        except RideRequest.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status == "cancelled" and ride_request.status in ["pending", "offered"]:
            ride_request.status = "cancelled"
            ride_request.save(update_fields=["status"])

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "drivers_available",
                {"type": "ride_cancelled", "ride_request_id": str(ride_request.id)},
            )

        return Response(RideRequestSerializer(ride_request).data)


class CreateRideOfferView(APIView):
    permission_classes = [IsDriver]

    def post(self, request):
        serializer = RideOfferCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ride_request = serializer.validated_data["ride_request"]
        if ride_request.status not in ["pending", "offered"]:
            return Response(
                {"error": "This ride is no longer accepting offers"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        offer = serializer.save(driver=request.user)

        if ride_request.status == "pending":
            ride_request.status = "offered"
            ride_request.save(update_fields=["status"])

        # Notify the rider via WebSocket
        channel_layer = get_channel_layer()
        offer_data = RideOfferSerializer(offer).data
        async_to_sync(channel_layer.group_send)(
            f"ride_request_{ride_request.id}",
            {"type": "new_offer", "data": offer_data},
        )

        return Response(offer_data, status=status.HTTP_201_CREATED)


class ListRideOffersView(ListAPIView):
    serializer_class = RideOfferSerializer

    def get_queryset(self):
        ride_request_id = self.request.query_params.get("ride_request")
        if ride_request_id:
            return RideOffer.objects.filter(ride_request_id=ride_request_id)
        return RideOffer.objects.none()


class AcceptOfferView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        offer_id = request.data.get("offer_id")
        try:
            offer = RideOffer.objects.select_related("ride_request", "driver").get(pk=offer_id)
        except RideOffer.DoesNotExist:
            return Response({"error": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

        ride_request = offer.ride_request
        if ride_request.rider != request.user:
            return Response({"error": "Not your ride"}, status=status.HTTP_403_FORBIDDEN)

        if ride_request.status not in ["pending", "offered"]:
            return Response({"error": "Ride already accepted"}, status=status.HTTP_400_BAD_REQUEST)

        # Accept the offer
        offer.status = "accepted"
        offer.save(update_fields=["status"])

        # Reject all other offers
        RideOffer.objects.filter(ride_request=ride_request).exclude(pk=offer.pk).update(status="rejected")

        # Update ride request
        ride_request.status = "accepted"
        ride_request.accepted_offer = offer
        ride_request.save(update_fields=["status", "accepted_offer"])

        channel_layer = get_channel_layer()
        ride_data = RideRequestSerializer(ride_request).data

        # Notify the accepted driver
        async_to_sync(channel_layer.group_send)(
            f"driver_{offer.driver.id}",
            {"type": "offer_accepted", "data": ride_data},
        )

        # Tell all drivers to remove this request
        async_to_sync(channel_layer.group_send)(
            "drivers_available",
            {"type": "ride_cancelled", "ride_request_id": str(ride_request.id)},
        )

        # Notify rider's WS channel
        async_to_sync(channel_layer.group_send)(
            f"ride_request_{ride_request.id}",
            {
                "type": "ride_confirmed",
                "data": {
                    "ride_request": ride_data,
                    "driver": {
                        "id": str(offer.driver.id),
                        "full_name": offer.driver.full_name,
                        "phone_number": offer.driver.phone_number,
                    },
                    "price": str(offer.price),
                },
            },
        )

        # Auto-add to ride history so drivers can revisit who they helped
        CompletedRide.objects.create(
            ride_request=ride_request,
            driver=offer.driver,
            rider=request.user,
            final_price=offer.price,
            distance_miles=ride_request.distance_miles,
            pickup_time=timezone.now(),
        )

        return Response(ride_data)


class CompleteRideView(APIView):
    permission_classes = [IsDriver]

    def post(self, request, pk):
        try:
            ride_request = RideRequest.objects.get(pk=pk, status="accepted")
        except RideRequest.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        if ride_request.accepted_offer.driver != request.user:
            return Response({"error": "Not your ride"}, status=status.HTTP_403_FORBIDDEN)

        ride_request.status = "completed"
        ride_request.save(update_fields=["status"])

        # Update the existing history entry (created at acceptance) with completion details
        CompletedRide.objects.filter(ride_request=ride_request).update(
            dropoff_time=timezone.now(),
        )

        # Update profiles
        driver_profile = request.user.driver_profile
        driver_profile.total_rides += 1
        driver_profile.save(update_fields=["total_rides"])

        rider_profile = ride_request.rider.rider_profile
        rider_profile.total_rides += 1
        rider_profile.save(update_fields=["total_rides"])

        # Notify rider
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"rider_{ride_request.rider.id}",
            {"type": "ride_completed", "data": RideRequestSerializer(ride_request).data},
        )

        return Response(RideRequestSerializer(ride_request).data)


class RideHistoryView(ListAPIView):
    serializer_class = CompletedRideSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "rider":
            return CompletedRide.objects.filter(rider=user)
        elif user.role == "driver":
            return CompletedRide.objects.filter(driver=user)
        return CompletedRide.objects.none()


class ActiveRideView(APIView):
    def get(self, request):
        user = request.user
        if user.role == "rider":
            ride = RideRequest.objects.filter(
                rider=user, status__in=["pending", "offered", "accepted", "in_progress"]
            ).first()
        elif user.role == "driver":
            ride = RideRequest.objects.filter(
                accepted_offer__driver=user, status__in=["accepted", "in_progress"]
            ).first()
        else:
            ride = None

        if ride:
            return Response(RideRequestSerializer(ride).data)
        return Response(None)


class RateRideView(APIView):
    permission_classes = [IsRider]

    def post(self, request):
        ride_id = request.data.get("ride_id")
        rating = request.data.get("rating")
        review_text = request.data.get("review_text", "").strip()

        if not ride_id or not rating:
            return Response({"error": "ride_id and rating required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rating = int(rating)
            if not (1 <= rating <= 5):
                raise ValueError
        except (ValueError, TypeError):
            return Response({"error": "Rating must be 1–5"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            completed_ride = CompletedRide.objects.select_related("driver__driver_profile").get(
                id=ride_id, rider=request.user
            )
        except CompletedRide.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        if completed_ride.driver_rating is not None:
            return Response({"error": "Already rated"}, status=status.HTTP_400_BAD_REQUEST)

        completed_ride.driver_rating = rating
        completed_ride.review_text = review_text
        completed_ride.save(update_fields=["driver_rating", "review_text"])

        # Recalculate driver's average rating
        driver_profile = completed_ride.driver.driver_profile
        all_ratings = list(
            CompletedRide.objects.filter(
                driver=completed_ride.driver, driver_rating__isnull=False
            ).values_list("driver_rating", flat=True)
        )
        driver_profile.rating = round(sum(all_ratings) / len(all_ratings), 2) if all_ratings else 5.0
        driver_profile.save(update_fields=["rating"])

        return Response(CompletedRideSerializer(completed_ride).data)


class PendingRatingsView(ListAPIView):
    permission_classes = [IsRider]
    serializer_class = CompletedRideSerializer

    def get_queryset(self):
        return CompletedRide.objects.filter(
            rider=self.request.user,
            driver_rating__isnull=True,
            dropoff_time__isnull=False,
        ).select_related("driver__driver_profile", "ride_request")


class AdminRidesView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = RideRequestSerializer
    queryset = RideRequest.objects.all()
