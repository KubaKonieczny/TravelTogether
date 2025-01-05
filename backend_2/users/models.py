from django.contrib.auth.base_user import BaseUserManager


class MyCustomUserManager(BaseUserManager):

    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email=email,
            password=password,
        )

        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user


from django.contrib.auth.models import AbstractUser
from django.db import models


class Users(AbstractUser, models.Model):
    username = None
    email = models.EmailField(max_length=254, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    profile_picture = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(max_length=2000, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']


class Friend_Invitations(models.Model):
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='friend_sender')
    receiver = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='friend_receiver')

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('revoked', 'Revoked')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Messages(models.Model):
    sender = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='message_sender')
    receiver = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='message_receiver')
    content = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)


class User_Blocks(models.Model):
    blocker = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='blocker')
    blocked = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='blocked')
    created_at = models.DateTimeField(auto_now_add=True)
