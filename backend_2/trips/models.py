from datetime import datetime

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from users.models import Users


class Trips(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    trip_picture = models.CharField(max_length=200, blank=True, null=True)

    VISIBILITY = [
        ('private', 'Private'),
        ('friends', 'Friends'),
        ('public', 'Public'),
    ]
    visibility = models.CharField(max_length=20, choices=VISIBILITY, default='private')

    start_date = models.DateField(default=timezone.now())
    end_date = models.DateField(default=timezone.now())

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Trip_Members(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    trip = models.ForeignKey(Trips, on_delete=models.CASCADE)

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('owner', 'Owner'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'trip')

    def __str__(self):
        return f'{self.user.username} - {self.trip.name} ({self.role})'


class Trip_Invitations(models.Model):
    trip = models.ForeignKey(Trips, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='trip_sender')

    TYPE_CHOICES = [
        ('request', 'Request'),
        ('invitation', 'Invitation')
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('revoked', 'Revoked')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Step_Groups(models.Model):
    trip = models.ForeignKey(Trips, on_delete=models.CASCADE)
    region = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TripSteps(models.Model):
    step_group = models.ForeignKey(Step_Groups, on_delete=models.CASCADE)

    STEP_TYPE_CHOICES = [
        ('place', 'Place'),
        ('travel', 'Travel'),
        ('accommodation', 'Accommodation'),
    ]
    type = models.CharField(
        max_length=20,
        choices=STEP_TYPE_CHOICES,
        default='place'
    )

    name = models.CharField(max_length=50)

    start = models.DateTimeField(null=True)
    end = models.DateTimeField(null=True)

    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100, null=True)

    cost = models.IntegerField(null=True)

    currency = models.CharField(max_length=3, null=True)

    distance = models.IntegerField(null=True)

    notes = models.TextField(max_length=2000, blank=True, null=True)

    attachment = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.type})"
