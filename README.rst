Tsuro
=====

Le game.

Setup
-----

.. code:: console

    $ pip install -r requirements.txt
    $ docker-compose up -d

Create the ``tsuro/settings/local.py`` file:

.. code:: python

    from .base import *  # noqa

    ADMINS = (('Yoan Blanc', 'yoan@dosimple.ch'), )

    MANAGERS = ADMINS

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'tsuro',
            'USER': 'tsuro',
            'PASSWORD': 'tsuro',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

    if IN_TESTING:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': '/tmp/tsuro_test.db',
            }
        }

And continue.

.. code:: console


    $ export DJANGO_SETTINGS_MODULE=tsuro.settings.local
    $ python manage.py migrate
    $ python manage.py createsuperuser
    $ python manage.py runserver

Profit!
