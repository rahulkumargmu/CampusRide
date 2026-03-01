from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("rides", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="completedride",
            name="review_text",
            field=models.CharField(blank=True, default="", max_length=300),
        ),
    ]
