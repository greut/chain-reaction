from .base import *  # noqa

SESSION_ENGINE = "django.contrib.sessions.backends.file"

CACHES["default"] = {"BACKEND": "django.core.cache.backends.dummy.DummyCache"}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'chain_reaction.db',
    }
}
