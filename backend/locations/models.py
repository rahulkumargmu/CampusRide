from django.db import models


class USCity(models.Model):
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=2, db_index=True)
    state_name = models.CharField(max_length=50)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    population = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "us_cities"
        ordering = ["city", "state"]
        unique_together = ["city", "state"]

    def __str__(self):
        return f"{self.city}, {self.state}"
