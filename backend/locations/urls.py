from django.urls import path
from . import views

urlpatterns = [
    path("autocomplete/", views.CityAutocompleteView.as_view(), name="city_autocomplete"),
    path("distance/", views.DistanceView.as_view(), name="distance"),
]
