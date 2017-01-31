web: python manage.py runserver --noworker
daphne: daphne -b 127.0.0.1 -p 8001 tsuro.asgi:channel_layer
worker: python manage.py runworker
