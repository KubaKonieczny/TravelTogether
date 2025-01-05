from rest_framework import serializers

from users.serializers import CustomUserDetailsSerializer
from .models import Trips, Trip_Members, Trip_Invitations, Step_Groups, TripSteps


class TripStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripSteps
        fields = [
            'id',
            "type",
            "name",
            "start",
            "end",
            "start_location",
            "end_location",
            "cost",
            "currency",
            "distance",
            "notes",
            "attachment",
            "step_group"
        ]


class StepGroupSerializer(serializers.ModelSerializer):
    steps = TripStepSerializer(many=True, read_only=True, source="tripsteps_set")

    class Meta:
        model = Step_Groups
        fields = ['id', "region", "steps", 'trip']


class TripSerializer(serializers.ModelSerializer):
    step_groups = StepGroupSerializer(many=True, read_only=True, source="step_groups_set")

    class Meta:
        model = Trips
        fields = [
            'id',
            "name",
            "description",
            "start_date",
            'trip_picture',
            'visibility',
            "end_date",
            "step_groups"
        ]


class TripInvitationSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer()
    trip = TripSerializer(many=True, read_only=True)

    class Meta:
        model = Trip_Invitations
        fields = ['id', 'trip', 'user', 'type', 'status', 'created_at']


class TripMemberSerializer(serializers.ModelSerializer):
    user = CustomUserDetailsSerializer()
    trip = TripSerializer(many=True, read_only=True)

    class Meta:
        model = Trip_Members
        fields = ['id', 'trip', 'user', 'role', 'created_at']
