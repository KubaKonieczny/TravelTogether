from rest_framework import serializers

from trips.serializers import TripSerializer
from users.serializers import CustomUserDetailsSerializer
from .models import Groups, Group_Invitations, Group_Trips, Group_Members, Group_Messages


class GroupSerializer(serializers.ModelSerializer):


    class Meta:
        model = Groups
        fields = ['id', 'name', 'description', 'group_picture', 'created_at']


class GroupTripsSerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only=True)
    trip = TripSerializer(read_only=True)
    class Meta:
        model = Group_Trips
        fields = "__all__"


class GroupMessagesSerializer(serializers.ModelSerializer):
    sender = CustomUserDetailsSerializer()
    group = GroupSerializer()

    class Meta:
        model = Group_Messages
        fields = ['id', 'content', 'created_at', "group", 'sender']


class GroupInvitationSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer()
    group = GroupSerializer()

    class Meta:
        model = Group_Invitations
        fields = ['id', 'type', 'status', 'created_at', 'group', 'user']


class GroupMemberSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer()
    group = GroupSerializer()

    class Meta:
        model = Group_Members
        fields = ['id', 'role', 'created_at', 'group', 'user']
