import json
import os
from django.core.management.base import BaseCommand
from locations.models import USCity


class Command(BaseCommand):
    help = "Load US cities from JSON data file into the database"

    def handle(self, *args, **options):
        data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "us_cities.json")
        data_path = os.path.abspath(data_path)

        if not os.path.exists(data_path):
            self.stderr.write(self.style.ERROR(f"Data file not found: {data_path}"))
            return

        with open(data_path, "r") as f:
            cities = json.load(f)

        objs = [
            USCity(
                city=c["city"],
                state=c["state_id"],
                state_name=c["state_name"],
                latitude=c["lat"],
                longitude=c["lng"],
                population=c.get("population", 0),
            )
            for c in cities
        ]

        USCity.objects.all().delete()
        USCity.objects.bulk_create(objs, batch_size=1000)
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(objs)} cities"))
