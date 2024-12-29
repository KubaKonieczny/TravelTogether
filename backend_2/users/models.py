# from django.db import models
#
# # Create your models here.
#
# from django.db import models
# from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
#
#
# class UserAccountManager(BaseUserManager):
#     def create_user(self, email, password=None, **kwargs):
#
#         if not email:
#             raise ValueError("Users must have an email address")
#
#         email = self.normalize_email(email)
#         email = email.lower()
#
#         user = self.model(
#             email=email,
#             **kwargs
#         )
#
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#
#     def create_superuser(self, email, password=None, **kwargs):
#         user = self.create_user(
#             email,
#             password=password,
#
#             **kwargs
#         )
#         user.is_staff = True
#         user.is_superuser = True
#         user.save(using=self._db)
#         return user
#
#
# class UserAccount(AbstractBaseUser, PermissionsMixin):
#     first_name = models.CharField(max_length=255)
#     last_name = models.CharField(max_length=255)
#     email = models.EmailField(max_length=255, unique=True)
#
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     is_superuser = models.BooleanField(default=False)
#
#     objects = UserAccountManager()
#
#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ["first_name", "last_name"]
#
#     def __str__(self):
#         return self.email
import uuid

from django.contrib.auth.base_user import BaseUserManager


# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.db import models
# from django.utils.timezone import now
#
# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, name, surname, password=None, **extra_fields):
#         if not email:
#             raise ValueError("The Email field must be set")
#         email = self.normalize_email(email)
#         user = self.model(email=email, name=name, surname=surname, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#
#     def create_superuser(self, email, name, surname, password=None, **extra_fields):
#         extra_fields.setdefault('is_admin', True)
#         extra_fields.setdefault('is_active', True)
#         return self.create_user(email, name, surname, password, **extra_fields)
#
# class User(AbstractBaseUser, PermissionsMixin):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=50)
#     surname = models.CharField(max_length=50)
#     email = models.EmailField(unique=True, max_length=100)
#     password = models.CharField(max_length=255)
#     is_admin = models.BooleanField(default=False)
#     provider = models.CharField(
#         max_length=20,
#         choices=[('local', 'Local'), ('google', 'Google'), ('facebook', 'Facebook')],
#         default='local'
#     )
#     profile_picture = models.CharField(max_length=100, blank=True, null=True)
#     description = models.TextField(max_length=2000, blank=True, null=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(default=now)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['name', 'surname']
#
#     objects = CustomUserManager()
#
#     def __str__(self):
#         return self.email


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

