# Generated by Django 5.0.7 on 2024-12-29 18:05

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('groups', '0001_initial'),
        ('trips', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='group_invitations',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_sender', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group_members',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group_messages',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group_trips',
            name='trip',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='trips.trips'),
        ),
        migrations.AddField(
            model_name='group_trips',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.groups'),
        ),
        migrations.AddField(
            model_name='group_messages',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.groups'),
        ),
        migrations.AddField(
            model_name='group_members',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.groups'),
        ),
        migrations.AddField(
            model_name='group_invitations',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.groups'),
        ),
        migrations.AlterUniqueTogether(
            name='group_members',
            unique_together={('user', 'group')},
        ),
    ]
