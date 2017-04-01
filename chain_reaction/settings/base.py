import os
import sys

# PATH vars

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root = lambda *x: os.path.join(BASE_DIR, *x)

sys.path.insert(0, root('apps'))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'CHANGE THIS!!!')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
IN_TESTING = sys.argv[1:2] == ['test']

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'registration',  # should be immediatly above d.c.auth
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'authtools',
    'channels',
    'django_extensions',
    'django_nvd3',
    'social_django',
    'webpack_loader',
    'crispy_forms',
    'myauth',
    'games',
]

PROJECT_APPS = []

INSTALLED_APPS += PROJECT_APPS

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'chain_reaction.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'chain_reaction.wsgi.application'

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'chain_reaction',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST':
        '',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',  # Set to empty string for default.
    }
}

# Internationalization

LANGUAGE_CODE = 'en-gb'

TIME_ZONE = 'Europe/Zurich'

USE_I18N = False

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)

STATIC_URL = '/static/'

STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder")

# Webpack loader

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'gen/',
        'STATS_FILE': os.path.join(BASE_DIR, os.pardir, 'webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'TIMEOUT': None,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}

# Forms

CRISPY_TEMPLATE_PACK = "bootstrap4"

# Additional locations of static files

STATICFILES_DIRS = (root('assets'), )

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'APP_DIRS': True,
    'DIRS': [
        root('templates'),
    ],
    'OPTIONS': {
        'debug':
        DEBUG,
        'context_processors': [
            'django.contrib.auth.context_processors.auth',
            'django.template.context_processors.debug',
            'django.template.context_processors.i18n',
            'django.template.context_processors.media',
            'django.template.context_processors.static',
            'django.template.context_processors.tz',
            'django.contrib.messages.context_processors.messages',
            'social_django.context_processors.backends',
            'social_django.context_processors.login_redirect',
        ],
    },
}]

# Auth

AUTH_USER_MODEL = 'myauth.User'

# Registration

ACCOUNT_ACTIVATION_DAYS = 7
REGISTRATION_AUTO_LOGIN = True

# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Backends

AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.github.GithubOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]

# Social Auth

SOCIAL_AUTH_URL_NAMESPACE = 'social'
SOCIAL_AUTH_ADMIN_USER_SEARCH_FIELDS = ('name', 'email')

SOCIAL_AUTH_FACEBOOK_SCOPE = ['email']
SOCIAL_AUTH_GITHUB_SCOPE = ['user:email']

# Django Authtools

LOGIN_REDIRECT_URL = 'game-list'

# Channels

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'asgi_redis.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('localhost', 6379)],
            'symmetric_encryption_keys': [SECRET_KEY],
        },
        'ROUTING': 'chain_reaction.routing.channel_routing',
    }
}

# Cache

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        }
    }
}

# Session

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

# .local.py overrides all the common settings.
try:
    from .local import *  # noqa

    INSTALLED_APPS.append('debug_toolbar')
    MIDDLEWARE_CLASSES.insert(
        0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
    CHANNEL_LAYERS['default']['CONFIG']['hosts'] = [
        (REDIS_HOST, REDIS_PORT),
    ]
    CACHES['default']['LOCATION'] = "redis://{}:{}/1".format(
        REDIS_HOST, REDIS_PORT)
except ImportError:
    pass

# importing test settings file if necessary
if IN_TESTING:
    from .testing import *  # noqa
