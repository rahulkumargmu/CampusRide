import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async


class DriverConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous or self.user.role != "driver":
            await self.close()
            return

        self.group_name = "drivers_available"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        self.personal_group = f"driver_{self.user.id}"
        await self.channel_layer.group_add(self.personal_group, self.channel_name)

        await self.accept()
        await self.mark_driver_available(True)

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        if hasattr(self, "personal_group"):
            await self.channel_layer.group_discard(self.personal_group, self.channel_name)
        if hasattr(self, "user") and not self.user.is_anonymous:
            await self.mark_driver_available(False)

    async def new_ride_request(self, event):
        await self.send_json({"type": "new_ride_request", "ride_request": event["data"]})

    async def offer_accepted(self, event):
        await self.send_json({"type": "offer_accepted", "ride_request": event["data"]})

    async def ride_cancelled(self, event):
        await self.send_json({"type": "ride_cancelled", "ride_request_id": event["ride_request_id"]})

    @database_sync_to_async
    def mark_driver_available(self, available):
        try:
            profile = self.user.driver_profile
            profile.is_available = available
            profile.save(update_fields=["is_available"])
        except Exception:
            pass


class RiderConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous or self.user.role != "rider":
            await self.close()
            return

        self.ride_request_id = self.scope["url_route"]["kwargs"]["ride_request_id"]
        self.group_name = f"ride_request_{self.ride_request_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        self.personal_group = f"rider_{self.user.id}"
        await self.channel_layer.group_add(self.personal_group, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        if hasattr(self, "personal_group"):
            await self.channel_layer.group_discard(self.personal_group, self.channel_name)

    async def new_offer(self, event):
        await self.send_json({"type": "new_offer", "offer": event["data"]})

    async def offer_updated(self, event):
        await self.send_json({"type": "offer_updated", "offer": event["data"]})

    async def offer_withdrawn(self, event):
        await self.send_json({"type": "offer_withdrawn", "offer_id": event["offer_id"]})

    async def ride_confirmed(self, event):
        await self.send_json({"type": "ride_confirmed", "data": event["data"]})

    async def ride_completed(self, event):
        await self.send_json({"type": "ride_completed", "data": event["data"]})
