from django.contrib import admin
from django.urls import path, include
from accounts import views as account_views
from rides import views as ride_views

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/rides/", include("rides.urls")),
    path("api/locations/", include("locations.urls")),
    # Admin API endpoints
    path("api/admin/users/", account_views.AdminUserListView.as_view(), name="admin_users"),
    path("api/admin/users/create/", account_views.AdminCreateUserView.as_view(), name="admin_create_user"),
    path("api/admin/users/<uuid:user_id>/", account_views.AdminDeleteUserView.as_view(), name="admin_delete_user"),
    path("api/admin/online-users/", account_views.AdminOnlineUsersView.as_view(), name="admin_online_users"),
    path("api/admin/stats/", account_views.AdminStatsView.as_view(), name="admin_stats"),
    path("api/admin/rides/", ride_views.AdminRidesView.as_view(), name="admin_rides"),
]
