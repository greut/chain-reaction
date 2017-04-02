from .base import *  # noqa

CACHES = {
    "default": {
        "OPTIONS": {
            "REDIS_CLIENT_CLASS": "fakeredis.FakeStrictRedis"
        }
    }
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'chain_reaction.db',
    }
}
