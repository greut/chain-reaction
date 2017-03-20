#!/bin/bash

set -xe

. ~/.bash_profile
cd www/app
. bin/activate
export DJANGO_SETTINGS_MODULE=chain_reaction.settings.production
git pull
python manage.py migrate
python manage.py collectstatic --noinput
sudo sv restart uwsgi
sudo sv restart daphne
sudo sv restart worker
sudo sv reload nginx
