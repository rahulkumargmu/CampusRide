from rest_framework import serializers
from .models import USCity


class USCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = USCity
        fields = ["id", "city", "state", "state_name", "latitude", "longitude", "population"]
