import uuid

from django.db import transaction
from django.shortcuts import render, get_object_or_404
from google.cloud import storage

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone

from backend_2 import settings
from groups.models import Group_Invitations
from trips.models import Trip_Members, Trips, Trip_Invitations, Step_Groups, TripSteps
from trips.serializers import TripSerializer, TripMemberSerializer, TripInvitationSerializer, StepGroupSerializer, \
    TripStepSerializer
from users.models import Users


class TripViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        GET /api/trips/
        Returns all trips where the user is a member
        """
        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)
        trips = Trips.objects.filter(id__in=user_trips)

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        trip= get_object_or_404(Trips, pk=pk)

        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this group's trips"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TripSerializer(trip)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming_solo(self, request):
        """
        GET /api/trips/upcoming-solo/
        Returns upcoming and ongoing trips where the user is the only member
        """
        # Get all trips where the user is a member
        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)

        # Find trips with only one member (the user)
        solo_trips = Trips.objects.filter(id__in=user_trips).annotate(
            member_count=Count('trip_members')
        ).filter(member_count=1)

        # Could add date filtering here if you add start_date and end_date fields to Trips model
        solo_trips = solo_trips.filter(
            Q(start_date__gte=timezone.now()) |  # Upcoming trips
            Q(start_date__lte=timezone.now(), end_date__gte=timezone.now())  # Ongoing trips
        )

        serializer = TripSerializer(solo_trips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming_group(self, request):
        """
        GET /api/trips/upcoming-group/
        Returns upcoming and ongoing trips where the user is the only member
        """
        # Get all trips where the user is a member
        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)

        # Find trips with only one member (the user)
        group_trips = Trips.objects.filter(id__in=user_trips).annotate(
            member_count=Count('trip_members')
        ).filter(member_count__gt=1)

        # Could add date filtering here if you add start_date and end_date fields to Trips model
        group_trips  = group_trips.filter(
            Q(start_date__gte=timezone.now()) |  # Upcoming trips
            Q(start_date__lte=timezone.now(), end_date__gte=timezone.now())  # Ongoing trips
        )

        serializer = TripSerializer(group_trips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        """
        GET /api/trips/past/
        Returns upcoming and ongoing trips where the user is the only member
        """
        # Get all trips where the user is a member
        user_trips = Trip_Members.objects.filter(user=request.user).values_list('trip_id', flat=True)

        # Find trips with only one member (the user)
        group_trips = Trips.objects.filter(id__in=user_trips)

        # Could add date filtering here if you add start_date and end_date fields to Trips model
        group_trips = group_trips.filter(
            Q(end_date__lt=timezone.now())
        )

        serializer = TripSerializer(group_trips, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        """
        GET /api/trips/{id}/users/
        Returns list of users for a specific trip
        """
        # Check if trip exists and user has access to it
        trip = get_object_or_404(Trips, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Trip_Members.objects.filter(trip=trip, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's users"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all members of the trip
        trip_members = Trip_Members.objects.filter(trip=trip).select_related('user')
        serializer = TripMemberSerializer(trip_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def invitations(self, request, pk=None):
        """
        GET /api/trips/{id}/invitations/
        Returns list of users for a specific trip
        """
        # Check if trip exists and user has access to it
        trip = get_object_or_404(Trips, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Trip_Members.objects.filter(trip=trip, user=request.user, role__in=['admin', 'owner']).exists():
            return Response(
                {"error": "You don't have permission to view this trip's invitations"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all members of the trip
        trip_members = Trip_Members.objects.filter(trip=trip, type='invitation', status='pending').select_related('user')
        serializer = TripMemberSerializer(trip_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def requests(self, request, pk=None):
        """
        GET /api/trips/{id}/requests/
        Returns list of users for a specific trip
        """
        # Check if trip exists and user has access to it
        trip = get_object_or_404(Trips, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Trip_Members.objects.filter(trip=trip, user=request.user, role__in=['admin', 'owner']).exists():
            return Response(
                {"error": "You don't have permission to view this trip's invitations"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all members of the trip
        trip_members = Trip_Invitations.objects.filter(trip=trip, type='request', status='pending').select_related('user')
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
        # trip_invitation = get_object_or_404(Trip_Invitations, pk=pk, user=user_id)

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
    @transaction.atomic()
    def create_trip(self, request):
        trip_data = request.data
        groups_data = trip_data.pop('step_groups', [])

        if 'trip_picture' in request.FILES:
            trip_picture = request.FILES['trip_picture']

            # Upload to Google Cloud Storage
            try:
                # Initialize Google Cloud Storage client
                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                # Create a unique filename
                file_extension = trip_picture.name.split('.')[-1]
                unique_filename = f"trip_pictures/{uuid.uuid4()}.{file_extension}"

                # Create a new blob and upload the file
                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    trip_picture,
                    content_type=trip_picture.content_type
                )

                # Generate the public URL
                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                # Update request data with the file URL instead of the file
                request.data['trip_picture'] = public_url

            except Exception as e:
                return Response(
                    {"error": "Failed to upload trip picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

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

            # Upload to Google Cloud Storage
            try:
                # Initialize Google Cloud Storage client
                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                # Create a unique filename
                file_extension = trip_picture.name.split('.')[-1]
                unique_filename = f"group_pictures/{uuid.uuid4()}.{file_extension}"

                # Create a new blob and upload the file
                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    trip_picture,
                    content_type=trip_picture.content_type
                )

                # Generate the public URL
                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                # Update request data with the file URL instead of the file
                request.data['group_picture'] = public_url

            except Exception as e:
                return Response(
                    {"error": "Failed to upload trip picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        # Update trip details
        trip_serializer = TripSerializer(trip, data=trip_data, partial=True)
        if not trip_serializer.is_valid():
            return Response(trip_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        trip = trip_serializer.save()

        # Delete all existing groups and steps
        Step_Groups.objects.filter(trip=trip).delete()

        # Create new groups and steps exactly like in create
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

        return request

    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):

        Trips.objects.filter(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
