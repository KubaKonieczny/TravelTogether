from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.views import LoginView, LogoutView, PasswordChangeView
from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from authentication.views import GoogleLogin
from users.views import CustomRegisterView, CustomUserDetailsView

urlpatterns = (
    path("register/", CustomRegisterView.as_view(), name="rest_register"),
    path("login/", LoginView.as_view(), name="rest_login"),
    path('user/', CustomUserDetailsView.as_view(), name='user_details'),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("password-change/", PasswordChangeView.as_view(), name="password_change"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path("google/", GoogleLogin.as_view(), name="google_login"),
)
