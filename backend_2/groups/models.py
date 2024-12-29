from django.db import models
from django.contrib.auth.models import User

from trips.models import Trips
from users.models import Users


# Group model
class Groups(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    group_picture = models.CharField(max_length=200, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Group_Members(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    group = models.ForeignKey(Groups, on_delete=models.CASCADE)

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('owner', 'Owner'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'group')  # Ensure a user can't be in the same group multiple times

    def __str__(self):
        return f'{self.user.username} - {self.group.name} ({self.role})'


class Group_Messages(models.Model):
    sender = models.ForeignKey(Users, on_delete=models.CASCADE)
    group = models.ForeignKey(Groups, on_delete=models.CASCADE)
    content = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Group_Invitations(models.Model):

    group = models.ForeignKey(Groups, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='group_sender')

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


class Group_Trips(models.Model):
    trip = models.OneToOneField(Trips, on_delete=models.CASCADE)
    group = models.ForeignKey(Groups, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)