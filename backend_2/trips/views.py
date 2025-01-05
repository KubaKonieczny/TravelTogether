import json
import uuid

from django.db import transaction
from django.shortcuts import get_object_or_404
from google.cloud import storage

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone

from algorithm.TravelOptimizer import TravelOptimizer
from backend_2 import settings
from trips.models import Trip_Members, Trips, Trip_Invitations, Step_Groups, TripSteps
from trips.serializers import TripSerializer, TripMemberSerializer, TripInvitationSerializer, StepGroupSerializer, \
    TripStepSerializer
from users.models import Users


class TripViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):

        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)
        trips = Trips.objects.filter(id__in=user_trips)

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        trip = get_object_or_404(Trips, pk=pk)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this group's trips"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TripSerializer(trip)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming_solo(self, request):

        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)

        solo_trips = Trips.objects.filter(id__in=user_trips).annotate(
            member_count=Count('trip_members')
        ).filter(member_count=1)

        solo_trips = solo_trips.filter(
            Q(start_date__gte=timezone.now()) |
            Q(start_date__lte=timezone.now(), end_date__gte=timezone.now())
        )

        serializer = TripSerializer(solo_trips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming_group(self, request):

        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)

        group_trips = Trips.objects.filter(id__in=user_trips).annotate(
            member_count=Count('trip_members')
        ).filter(member_count__gt=1)

        group_trips = group_trips.filter(
            Q(start_date__gte=timezone.now()) |
            Q(start_date__lte=timezone.now(), end_date__gte=timezone.now())
        )

        serializer = TripSerializer(group_trips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):

        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)

        group_trips = Trips.objects.filter(id__in=user_trips)

        group_trips = group_trips.filter(
            Q(end_date__lt=timezone.now())
        )

        serializer = TripSerializer(group_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):

        trip = get_object_or_404(Trips, pk=pk)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's users"},
                status=status.HTTP_403_FORBIDDEN
            )

        trip_members = Trip_Members.objects.filter(trip=trip).select_related('user')
        serializer = TripMemberSerializer(trip_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def invitations(self, request, pk=None):

        trip = get_object_or_404(Trips, pk=pk)

        if not Trip_Members.objects.filter(trip=trip, user=request.user, role__in=['admin', 'owner']).exists():
            return Response(
                {"error": "You don't have permission to view this trip's invitations"},
                status=status.HTTP_403_FORBIDDEN
            )

        trip_members = Trip_Members.objects.filter(trip=trip, type='invitation', status='pending').select_related(
            'user')
        serializer = TripMemberSerializer(trip_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def requests(self, request, pk=None):

        trip = get_object_or_404(Trips, pk=pk)

        if not Trip_Members.objects.filter(trip=trip, user=request.user, role__in=['admin', 'owner']).exists():
            return Response(
                {"error": "You don't have permission to view this trip's invitations"},
                status=status.HTTP_403_FORBIDDEN
            )

        trip_members = Trip_Invitations.objects.filter(trip=trip, type='request', status='pending').select_related(
            'user')
        serializer = TripMemberSerializer(trip_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def request(self, request, pk=None):
        trip = get_object_or_404(Trips, pk=pk)

        try:
            user = Users.objects.get(id=request.data.get('user_id'))

            if Trip_Invitations.objects.filter(
                    Q(user=user),
                    status__in=['pending', 'accepted', 'denied'],
                    type__in=['request', 'invitation']
            ).exists():
                return Response(
                    {"error": "Group invitation already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            invitation = Trip_Invitations.objects.create(
                trip=trip,
                user=user,
                type=request.data.get('type'),
                status=request.data.get('status')
            )
            serializer = TripInvitationSerializer(invitation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Users.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['put'])
    def request(self, request, pk=None, user_id=None):

        try:
            invitation = Trip_Invitations.objects.get(
                pk=pk,
                user=user_id,
                status='pending'
            )

            new_status = request.data.get('status')
            if new_status not in ['accepted', 'denied']:
                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            invitation.status = new_status
            invitation.save()

            serializer = TripInvitationSerializer(invitation)
            return Response(serializer.data)
        except Trip_Invitations.DoesNotExist:
            return Response(
                {"error": "Invitation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def create_trip(self, request):

        if 'trip_picture' in request.FILES:
            trip_picture = request.FILES['trip_picture']

            try:

                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                file_extension = trip_picture.name.split('.')[-1]
                unique_filename = f"trip_pictures/{uuid.uuid4()}.{file_extension}"

                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    trip_picture,
                    content_type=trip_picture.content_type
                )

                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                request.data['trip_picture'] = public_url

            except Exception as e:
                return Response(
                    {"error": "Failed to upload trip picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        trip_data = request.data.copy()
        groups_data = trip_data.pop('step_groups', [''])[0]

        groups_data = json.loads(groups_data)

        trip_serializer = TripSerializer(data=trip_data)
        if trip_serializer.is_valid():
            trip = trip_serializer.save()

            trip_member = Trip_Members.objects.create(
                user=request.user,
                trip=trip,
                role='owner'
            )

            for group_data in groups_data:
                steps_data = group_data.pop('steps', [])
                group_data['trip'] = trip.id

                group_serializer = StepGroupSerializer(data=group_data)

                if group_serializer.is_valid():

                    group = group_serializer.save()

                    for step_data in steps_data:
                        step_data['step_group'] = group.id
                        step_serializer = TripStepSerializer(data=step_data)
                        if step_serializer.is_valid():
                            step_serializer.save()
                        else:
                            trip.delete()
                            return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    trip.delete()
                    return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)
        return Response(trip_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    @transaction.atomic
    def update_trip(self, request, pk=None):
        try:
            trip = Trips.objects.get(pk=pk)
        except Trips.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        trip_data = request.data
        groups_data = trip_data.pop('step_groups', [])

        if 'trip_picture' in request.FILES:
            trip_picture = request.FILES['trip_picture']

            try:

                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                file_extension = trip_picture.name.split('.')[-1]
                unique_filename = f"trip_pictures/{uuid.uuid4()}.{file_extension}"

                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    trip_picture,
                    content_type=trip_picture.content_type
                )

                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                request.data['group_picture'] = public_url

            except Exception as e:
                return Response(
                    {"error": "Failed to upload trip picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        trip_serializer = TripSerializer(trip, data=trip_data, partial=True)
        if not trip_serializer.is_valid():
            return Response(trip_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        trip = trip_serializer.save()

        Step_Groups.objects.filter(trip=trip).delete()

        for group_data in groups_data:
            steps_data = group_data.pop('steps', [])
            group_data['trip'] = trip.id

            group_serializer = StepGroupSerializer(data=group_data)
            if group_serializer.is_valid():
                group = group_serializer.save()

                for step_data in steps_data:
                    step_data['step_group'] = group.id
                    step_serializer = TripStepSerializer(data=step_data)
                    if not step_serializer.is_valid():
                        return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    step_serializer.save()
            else:
                return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['get'])
    def get_trip(self, request, pk=None):
        try:
            trip = Trips.objects.get(pk=pk)
        except Trips.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = TripSerializer(trip)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def optimize(self, request, pk=None):

        return TravelOptimizer().optimizeTravel(request.data)

    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):

        Trips.objects.filter(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def create_step_groups(self, request, pk=None):

        try:
            trip = Trips.objects.get(pk=pk)
        except Trips.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's steps"},
                status=status.HTTP_403_FORBIDDEN
            )

        group_data = request.data.copy()

        group_data['trip'] = trip.id
        print(group_data)
        group_serializer = StepGroupSerializer(data=group_data)

        if group_serializer.is_valid():
            group = group_serializer.save()
            print("group", group)
        else:
            return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(StepGroupSerializer(group).data)

    @action(detail=True, methods=['post'])
    def create_step(self, request, pk=None):

        try:
            trip = Trips.objects.get(pk=pk)
        except Trips.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's steps"},
                status=status.HTTP_403_FORBIDDEN
            )

        step_serializer = TripStepSerializer(data=request.data)

        if step_serializer.is_valid():
            step = step_serializer.save()

        else:
            return Response(step_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(TripStepSerializer(step).data)

    @action(detail=True, methods=['get'])
    def step_groups(self, request, pk=None):

        try:
            trip = Trips.objects.get(pk=pk)
        except Trips.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's steps"},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            step_groups = Step_Groups.objects.filter(
                trip_id=pk
            )
        except TripSteps.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = StepGroupSerializer(step_groups, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def info(self, request, pk=None):

        try:
            trip = Trips.objects.get(pk=pk)
        except Trips.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's steps"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TripSerializer(trip)
        return Response(serializer.data)
