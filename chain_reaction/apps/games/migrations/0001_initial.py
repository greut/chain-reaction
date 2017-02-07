# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-07 09:18
from __future__ import unicode_literals

from django.db import migrations, models
import django_extensions.db.fields
import djchoices.choices
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False)),
                ('title', models.CharField(max_length=255)),
                ('type', models.CharField(choices=[('O', 'Open'), ('R', 'Running'), ('U', 'Unfinished'), ('D', 'Done')], max_length=1, validators=[djchoices.choices.ChoicesValidator({'D': 'Done', 'O': 'Open', 'R': 'Running', 'U': 'Unfinished'})])),
            ],
            options={
                'ordering': ('-modified', '-created'),
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
    ]
