import random
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
from groups.models import Group_Invitations, Group_Members, Groups, Group_Trips
from groups.serializer import GroupSerializer, GroupMemberSerializer, GroupInvitationSerializer
from trips.models import Trips
from trips.serializers import TripSerializer

from users.models import Users


class GroupViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        GET /api/trips/
        Returns all trips where the user is a member
        """
        user_groups = Group_Members.objects.filter(user=request.user).values_list('group_id', flat=True)

        groups = Groups.objects.filter(id__in=user_groups)

        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)


    def retrieve(self, request, pk=None):
        group = get_object_or_404(Groups, pk=pk)

        if not Group_Members.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this group's trips"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = GroupSerializer(group)
        return Response(serializer.data)


    @action(detail=False, methods=['get'])
    def upcoming_trips(self, request, pk=None):
        """
        GET /api/trips/upcoming-group/
        Returns upcoming and ongoing trips where the user is the only member
        """

        group = get_object_or_404(Groups, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Group_Members.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this group's trips"},
                status=status.HTTP_403_FORBIDDEN
            )


        # Get all trips where the user is a member
        group_trips_list = Group_Trips.objects.filter(group=pk).values_list('trip_id', flat=True)

        # Find trips with only one member (the user)
        group_trips = Trips.objects.filter(id__in=group_trips_list)

        # Could add date filtering here if you add start_date and end_date fields to Trips model
        group_trips = group_trips .filter(
            Q(start_date__gte=timezone.now()) |  # Upcoming trips
            Q(start_date__lte=timezone.now(), end_date__gte=timezone.now())  # Ongoing trips
        )

        serializer = TripSerializer(group_trips, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past_trips(self, request, pk=None):
        """
        GET /api/trips/past/
        Returns upcoming and ongoing trips where the user is the only member
        """

        group = get_object_or_404(Groups, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Group_Members.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this group's trips"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all trips where the user is a member
        group_trips_list = Group_Trips.objects.filter(group=pk).values_list('trip_id', flat=True)

        # Find trips with only one member (the user)
        group_trips = Trips.objects.filter(id__in=group_trips_list)

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
        group = get_object_or_404(Groups, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Group_Members.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You don't have permission to view this trip's users"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all members of the trip
        trip_members = Group_Members.objects.filter(group=group).select_related('user')
        serializer = GroupMemberSerializer(trip_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def invitations(self, request, pk=None):
        """
        GET /api/trips/{id}/invitations/
        Returns list of users for a specific trip
        """
        # Check if trip exists and user has access to it
        group = get_object_or_404(Groups, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Group_Members.objects.filter(group=group, user=request.user, role__in=['admin', 'owner']).exists():
            return Response(
                {"error": "You don't have permission to view this group's invitations"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all members of the trip
        group_members = Group_Members.objects.filter(group=group, type='invitation', status='pending').select_related('user')
        serializer = GroupMemberSerializer(group_members, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def requests(self, request, pk=None):
        """
        GET /api/trips/{id}/requests/
        Returns list of users for a specific trip
        """
        # Check if trip exists and user has access to it
        group = get_object_or_404(Groups, pk=pk)

        # Check if the requesting user is a member of the trip
        if not Group_Members.objects.filter(group=group, user=request.user, role__in=['admin', 'owner']).exists():
            return Response(
                {"error": "You don't have permission to view this trip's invitations"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all members of the trip
        trip_members = Group_Invitations.objects.filter(group=group, type='request', status='pending').select_related('user')
        serializer = GroupMemberSerializer(trip_members, many=True)

        return Response(serializer.data)


    @action(detail=True, methods=['post'])
    def request(self, request, pk=None):
        group = get_object_or_404(Groups, pk=pk)

        try:
            user = Users.objects.get(id=request.data.get('user_id'))

            if Group_Invitations.objects.filter(
                Q(user=user),
                status__in=['pending', 'accepted', 'denied'],
                type__in=['request', 'invitation']
            ).exists():
                return Response(
                    {"error": "Group invitation already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            invitation = Group_Invitations.objects.create(
                group=group,
                user=user,
                type=request.data.get('type'),
                status=request.data.get('status')
            )
            serializer = GroupInvitationSerializer(invitation)
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
            invitation = Group_Invitations.objects.get(
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

            serializer = GroupInvitationSerializer(invitation)
            return Response(serializer.data)
        except Group_Invitations.DoesNotExist:
            return Response(
                {"error": "Invitation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    @transaction.atomic()
    def create_group(self, request):
        print("is it ok")
        if 'group_picture' in request.FILES:
            group_picture = request.FILES['group_picture']

            # Upload to Google Cloud Storage
            try:
                # Initialize Google Cloud Storage client
                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                # Create a unique filename
                file_extension = group_picture.name.split('.')[-1]
                unique_filename = f"group_pictures/{uuid.uuid4()}.{file_extension}"

                # Create a new blob and upload the file
                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    group_picture,
                    content_type=group_picture.content_type
                )

                # Generate the public URL
                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                # Update request data with the file URL instead of the file
                request.data['group_picture'] = public_url

            except Exception as e:
                return Response(
                    {"error": "Failed to upload group picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        group_serializer = GroupSerializer(data=request.data)
        if group_serializer.is_valid():
            group = group_serializer.save()

            group_member = Group_Members.objects.create(
                user=request.user,
                group=group,
                role='owner'
            )

            return Response(GroupSerializer(group).data, status=status.HTTP_201_CREATED)

        return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    @transaction.atomic
    def update_group(self, request, pk=None):
        try:
            group = Groups.objects.get(pk=pk)
        except Groups.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if 'group_picture' in request.FILES:
            group_picture = request.FILES['group_picture']

            # Upload to Google Cloud Storage
            try:
                # Initialize Google Cloud Storage client
                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                # Create a unique filename
                file_extension = group_picture.name.split('.')[-1]
                unique_filename = f"group_pictures/{uuid.uuid4()}.{file_extension}"

                # Create a new blob and upload the file
                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    group_picture,
                    content_type=group_picture.content_type
                )

                # Generate the public URL
                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                # Update request data with the file URL instead of the file
                request.data['profile_picture'] = public_url

            except Exception as e:
                return Response(
                    {"error": "Failed to upload profile picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        group_serializer = GroupSerializer(group, data=request.data, partial=True)
        if not group_serializer.is_valid():
            return Response(group_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        group = group_serializer.save()


        return Response(GroupSerializer(group).data)


    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):

        Groups.objects.filter(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """Returns list of recommended users (random users who are not friends)"""

        available_groups = Groups.objects.all()

        recommended = random.sample(list(available_groups), min(5, len(available_groups)))
        serializer = GroupSerializer(recommended, many=True)
        return Response(serializer.data)