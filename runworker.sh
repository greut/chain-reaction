#!/bin/sh

set -xe
export DJANGO_SETTINGS_MODULE=chain_reaction.settings.production
bin/python manage.py runworker
