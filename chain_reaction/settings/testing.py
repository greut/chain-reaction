from .base import *  # noqa

CACHES["default"] = {"BACKEND": "django.core.cache.backends.dummy.DummyCache"}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'chain_reaction.db',
    }
}
