Chain Reaction
==============

Le game.

Setup
-----

.. code:: console

    $ pip install -r requirements/local.txt
    $ docker-compose up -d

Create the ``chain_reaction/settings/local.py`` file:

.. code:: python

    from .base import *  # noqa

    ADMINS = (('Yoan Blanc', 'yoan@dosimple.ch'), )

    MANAGERS = ADMINS

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'chain_reaction',
            'USER': 'chain_reaction',
            'PASSWORD': 'chain_reaction',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

    if IN_TESTING:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': '/tmp/chain_reaction_test.db',
            }
        }

    EMAIL_HOST = '127.0.0.1'
    EMAIL_PORT = 1025

    REDIS_HOST = '127.0.0.1'
    REDIS_PORT = 6379

And continue.

.. code:: console


    $ export DJANGO_SETTINGS_MODULE=chain_reaction.settings.local
    $ python manage.py migrate
    $ python manage.py createsuperuser
    $ python manage.py runserver --noworker
    $ python manage.py runworker
    $ honcho start

Profit!

No Github?
----------

Syncing with a remote repository (or just use Github).

.. code:: console

    $ ssh srvz "git init --bare app.git"
    $ git remote add srvz ssh://srvz/home/yoan/app.git
    $ git push --set-upstream srvz master


Deployment
----------

.. code:: console

    $ cd /var/www
    $ git clone ... app
    $ cd app
    $ python3 -m venv venv
    $ . venv/bin/activate
    $ pip install -U pip
    $ pip install -r requirements/production.txt
    $ python manage.py migrate
    $ python manage.py createsuperuser
    $ python manage.py collectstatic

    $ run daphne # see Procfile
    $ run worker # see Procfile
    $ configure nginx.conf ... # todo
