import uuid

from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import UserDetailsView
from google.cloud import storage
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
import random

from backend_2 import settings

from .models import Users, Friend_Invitations, User_Blocks
from .serializers import FriendInvitationSerializer, UserBlockSerializer, CustomUserDetailsSerializer, \
    CustomRegisterSerializer


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer


class CustomUserDetailsView(UserDetailsView):
    serializer_class = CustomUserDetailsSerializer


class UserFriendsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def friends(self, request):

        friend_invitations = Friend_Invitations.objects.filter(
            (Q(sender=request.user) | Q(receiver=request.user)) &
            Q(status='accepted')
        )

        friends = []
        for invitation in friend_invitations:
            friend = invitation.receiver if invitation.sender == request.user else invitation.sender
            friends.append(friend)

        serializer = CustomUserDetailsSerializer(friends, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recommended_users(self, request):

        friends_ids = [inv.receiver.id if inv.sender == request.user else inv.sender.id
                       for inv in Friend_Invitations.objects.filter(
                Q(sender=request.user) | Q(receiver=request.user))]

        blocked_ids = User_Blocks.objects.filter(blocker=request.user).values_list('blocked_id', flat=True)

        available_users = Users.objects.exclude(
            Q(id=request.user.id) |
            Q(id__in=friends_ids) |
            Q(id__in=blocked_ids)
        )

        recommended = random.sample(list(available_users), min(5, len(available_users)))
        serializer = CustomUserDetailsSerializer(recommended, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def friends_requests(self, request):

        requests = Friend_Invitations.objects.filter(
            sender=request.user,
            status='pending'
        )
        serializer = FriendInvitationSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def friends_invitations(self, request):

        invitations = Friend_Invitations.objects.filter(
            receiver=request.user,
            status='pending'
        )
        serializer = FriendInvitationSerializer(invitations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def blocked(self, request):

        blocks = User_Blocks.objects.filter(blocker=request.user)
        serializer = UserBlockSerializer(blocks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def friends_requests_create(self, request):

        try:
            receiver = Users.objects.get(id=request.data.get('user_id'))

            if Friend_Invitations.objects.filter(
                    (Q(sender=request.user, receiver=receiver) |
                     Q(sender=receiver, receiver=request.user)),
                    status__in=['accepted', 'pending', "denied"]
            ).exists():
                return Response(
                    {"error": "Friend request already exists or users are already friends"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User_Blocks.objects.filter(
                    (Q(blocker=request.user, blocked=receiver) |
                     Q(blocker=receiver, blocked=request.user))
            ).exists():
                return Response(
                    {"error": "Cannot send friend request to blocked user"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            invitation = Friend_Invitations.objects.create(
                sender=request.user,
                receiver=receiver
            )
            serializer = FriendInvitationSerializer(invitation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Users.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['put'], url_path='friend-invitation/(?P<invitation_id>[^/.]+)')
    def friend_invitation_update(self, request, invitation_id=None):

        try:
            invitation = Friend_Invitations.objects.get(
                id=invitation_id,
                receiver=request.user,
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

            serializer = FriendInvitationSerializer(invitation)
            return Response(serializer.data)
        except Friend_Invitations.DoesNotExist:
            return Response(
                {"error": "Invitation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['put'])
    def blocked_update(self, request):

        try:
            user_to_block = Users.objects.get(id=request.data.get('user_id'))
            action = request.data.get('action')

            if action == 'block':
                # Create block if it doesn't exist
                block, created = User_Blocks.objects.get_or_create(
                    blocker=request.user,
                    blocked=user_to_block
                )

                Friend_Invitations.objects.filter(
                    (Q(sender=request.user, receiver=user_to_block) |
                     Q(sender=user_to_block, receiver=request.user))
                ).delete()

                serializer = UserBlockSerializer(block)
                return Response(serializer.data)

            elif action == 'unblock':
                block = User_Blocks.objects.filter(
                    blocker=request.user,
                    blocked=user_to_block
                ).delete()
                return Response({"message": "User unblocked successfully"})

            else:
                return Response(
                    {"error": "Invalid action"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Users.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):

        if 'profile_picture' in request.FILES:
            profile_picture = request.FILES['profile_picture']

            try:

                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

                file_extension = profile_picture.name.split('.')[-1]
                unique_filename = f"profile_pictures/{uuid.uuid4()}.{file_extension}"

                blob = bucket.blob(unique_filename)
                blob.upload_from_file(
                    profile_picture,
                    content_type=profile_picture.content_type
                )

                public_url = f"https://storage.googleapis.com/{settings.GCS_BUCKET_NAME}/{unique_filename}"

                request.data['profile_picture'] = public_url


            except Exception as e:
                return Response(
                    {"error": "Failed to upload profile picture"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        user_serializer = CustomUserDetailsSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if not user_serializer.is_valid():
            return Response(
                user_serializer.errors,

                status=status.HTTP_400_BAD_REQUEST
            )

        user = user_serializer.save()

        return Response(CustomUserDetailsSerializer(user).data)
