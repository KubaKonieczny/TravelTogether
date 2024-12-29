from dj_rest_auth.views import UserDetailsView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserFriendsViewSet

router = DefaultRouter()
router.register('', UserFriendsViewSet, basename='user')

urlpatterns = [
    path("me/", UserDetailsView.as_view(), name="rest_user_details"),
    path('', include(router.urls))
]
