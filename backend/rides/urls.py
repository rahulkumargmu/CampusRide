from django.urls import path
from . import views

urlpatterns = [
    path("request/", views.CreateRideRequestView.as_view(), name="create_ride_request"),
    path("requests/", views.ListRideRequestsView.as_view(), name="list_ride_requests"),
    path("request/<uuid:pk>/", views.RideRequestDetailView.as_view(), name="ride_request_detail"),
    path("request/<uuid:pk>/update/", views.UpdateRideRequestView.as_view(), name="update_ride_request"),
    path("offer/", views.CreateRideOfferView.as_view(), name="create_ride_offer"),
    path("offers/", views.ListRideOffersView.as_view(), name="list_ride_offers"),
    path("accept-offer/", views.AcceptOfferView.as_view(), name="accept_offer"),
    path("complete/<uuid:pk>/", views.CompleteRideView.as_view(), name="complete_ride"),
    path("history/", views.RideHistoryView.as_view(), name="ride_history"),
    path("active/", views.ActiveRideView.as_view(), name="active_ride"),
]
