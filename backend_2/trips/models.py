from datetime import datetime

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from users.models import Users


# Group model
class Trips(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    trip_picture = models.CharField(max_length=200, blank=True, null=True)

    start_date = models.DateField( default=timezone.now())
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
        unique_together = ('user', 'trip')  # Ensure a user can't be in the same group multiple times

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
    # Foreign key to the Trip model
    step_group = models.ForeignKey(Step_Groups, on_delete=models.CASCADE)
    # ENUM for step type (e.g., place, travel, accommodation)
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

    # Step name
    name = models.CharField(max_length=50)

    # Start and end timestamps
    start = models.DateTimeField()
    end = models.DateTimeField()

    # Locations for start and end
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)

    # Cost of the step
    cost = models.IntegerField()

    # Currency of the cost
    currency = models.CharField(max_length=3)

    # Distance in meters
    distance = models.IntegerField()

    # Notes for the step
    notes = models.TextField(max_length=2000, blank=True, null=True)

    # Attachment file path
    attachment = models.CharField(max_length=100, blank=True, null=True)

    # Timestamps for record creation and update
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.type})"
