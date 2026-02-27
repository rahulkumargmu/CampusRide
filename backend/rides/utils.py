import math
from decimal import Decimal


def haversine_miles(lat1, lon1, lat2, lon2):
    R = 3958.8  # Earth radius in miles
    lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return round(R * c, 2)


def calculate_suggested_price(distance_miles, base_rate=0.50, minimum_fare=3.00):
    price = float(distance_miles) * base_rate
    return Decimal(str(max(price, minimum_fare))).quantize(Decimal("0.01"))
