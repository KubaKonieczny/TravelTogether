from rest_framework import serializers

from users.serializers import CustomUserDetailsSerializer
from .models import Trips, Trip_Members, Trip_Invitations, Step_Groups, TripSteps


# class TripSerializer(serializers.ModelSerializer):
#     # members = TripMemberSerializer(source='trip_members_set', many=True, read_only=True)
#     # invitations = TripInvitationSerializer(source='trip_invitations_set', many=True, read_only=True)
#
#     class Meta:
#         model = Trips
#         fields = ['id', 'name', 'description', 'trip_picture', 'created_at', 'members', 'invitations']


class TripStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripSteps
        fields = '__all__'


class StepGroupSerializer(serializers.ModelSerializer):
    steps = TripStepSerializer(many=True, read_only=True)

    class Meta:
        model = Step_Groups
        fields = ['id', 'region', 'created_at', 'updated_at', 'steps']


class TripSerializer(serializers.ModelSerializer):
    step_groups = StepGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Trips
        fields = '__all__'

class TripMemberSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer()  # Assuming UserSerializer is already defined
    trip = TripSerializer(many=True, read_only=True)

    class Meta:
        model = Trip_Members
        fields = ['id', 'trip', 'user', 'role', 'created_at']


class TripInvitationSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer()
    trip = TripSerializer(many=True, read_only=True)

    class Meta:
        model = Trip_Invitations
        fields = ['id', 'trip', 'user', 'type', 'status', 'created_at']
