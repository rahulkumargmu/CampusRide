from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import USCity
from .serializers import USCitySerializer
from rides.utils import haversine_miles


class CityAutocompleteView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "").strip()
        if len(query) < 2:
            return Response([])

        cities = USCity.objects.filter(city__istartswith=query).order_by("city", "state")[:10]
        return Response(USCitySerializer(cities, many=True).data)


class DistanceView(APIView):
    def get(self, request):
        try:
            from_lat = float(request.query_params["from_lat"])
            from_lng = float(request.query_params["from_lng"])
            to_lat = float(request.query_params["to_lat"])
            to_lng = float(request.query_params["to_lng"])
        except (KeyError, ValueError):
            return Response({"error": "Missing or invalid coordinates"}, status=400)

        distance = haversine_miles(from_lat, from_lng, to_lat, to_lng)
        return Response({"distance_miles": distance})
