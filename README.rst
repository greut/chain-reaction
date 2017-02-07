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

    # Google OAuth 2.0 (see below)

    SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '...'
    SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '...'

    SOCIAL_AUTH_FACEBOOK_KEY = '...'
    SOCIAL_AUTH_FACEBOOK_SECRET = '...'

    SOCIAL_AUTH_GITHUB_KEY = '...'
    SOCIAL_AUTH_GITHUB_SECRET = '...'

And continue.

.. code:: console


    $ export DJANGO_SETTINGS_MODULE=chain_reaction.settings.local
    $ python manage.py migrate
    $ python manage.py createsuperuser
    $ python manage.py runserver --noworker
    $ python manage.py runworker
    $ honcho start

Profit!

Social Login
------------

Google OAuth 2.0
++++++++++++++++

Create a project on Google APIs, enable Google+ API and follow the instructions.

 - Which API are your using? *Google+ API*
 - Where will you be calling the API from? *Web browser (Javascript)*
 - What data will you be accessing? *User data*
 - Authorized JavaScript origins? ``http://localhost:8000``
 - Authorized redirect URIs? ``http://localhost:8000/complete/google-oauth2/``

`Documentation <http://python-social-auth-docs.readthedocs.io/en/latest/backends/google.html#google-oauth2>`_

Facebook OAuth 2.0
++++++++++++++++++

Create an appliation on Facebook developers and enable Facebook Login.

 - Valid OAuth redirect URIs? ``http://localhost:8000/complete/facebook``

`Documentation <http://python-social-auth-docs.readthedocs.io/en/latest/backends/facebook.html>`_

GitHub OAuth 2.0
++++++++++++++++

Create a new application on Github.

 - Authorization callback URL? ``http://localhost:8000/complete/github``

`Documentation <http://python-social-auth-docs.readthedocs.io/en/latest/backends/github.html>`_

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
