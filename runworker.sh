#!/bin/sh

set -xe
export DJANGO_SETTINGS_MODULE=tsuro.settings.production
bin/python manage.py runworker
