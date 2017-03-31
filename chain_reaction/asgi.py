import os
from channels.asgi import get_channel_layer

os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "chain_reaction.settings.production")

channel_layer = get_channel_layer()
