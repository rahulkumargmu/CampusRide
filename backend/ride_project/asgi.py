import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ride_project.settings")

django_asgi_app = get_asgi_application()

from ride_project.middleware import JWTWebSocketMiddleware
from rides.routing import websocket_urlpatterns as ride_ws
from notifications.routing import websocket_urlpatterns as notif_ws

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            JWTWebSocketMiddleware(URLRouter(ride_ws + notif_ws))
        ),
    }
)
