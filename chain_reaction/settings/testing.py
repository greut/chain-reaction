from .base import *  # noqa

import fakeredis

CACHES = {
    "default": {
        "OPTIONS": {
            "REDIS_CLIENT_CLASS": "fakeredis.FakeStrictRedis"
        }
    }
}
