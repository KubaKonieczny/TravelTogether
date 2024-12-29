from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from django.db import transaction

from users.models import Users
from dj_rest_auth.serializers import JWTSerializer
from .models import Users, Friend_Invitations, User_Blocks

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=50, required=True)
    last_name = serializers.CharField(max_length=50, required=True)

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['description'] = self.validated_data.get('description', '')
        data_dict['profile_picture'] = self.validated_data.get('profile_picture', '')
        return data_dict


    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.description = self.validated_data.get('description', '')
        user.profile_picture = self.validated_data.get('profile_picture', '')
        user.save()
        return user



class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        model = Users
        fields = (
            'pk',
            'email',
            'first_name',
            'last_name',
            'profile_picture',
            'description'

        )
        read_only_fields = ('pk', 'email')


class CustomJWTSerializer(JWTSerializer):
    user = CustomUserDetailsSerializer()

class FriendInvitationSerializer(serializers.ModelSerializer):
    sender = CustomUserDetailsSerializer(read_only=True)
    receiver = CustomUserDetailsSerializer(read_only=True)

    class Meta:
        model = Friend_Invitations
        fields = ['id', 'sender', 'receiver', 'status', 'created_at']

class UserBlockSerializer(serializers.ModelSerializer):
    blocked = CustomUserDetailsSerializer(read_only=True)

    class Meta:
        model = User_Blocks
        fields = ['id', 'blocked', 'created_at']


