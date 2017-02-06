import re
import json

from channels import Group
from channels.sessions import channel_session

from .models import Game


@channel_session
def ws_connect(message):
    message.reply_channel.send({'accept': True})
    room = message.content['path'].rsplit('/', 1)[1]

    if re.match(r'^[0-9]+$', room):
        game = Game.objects.get(pk=room)
    else:
        game = Game.objects.get(uuid=room)

    message.channel_session['room'] = game.uuid.hex
    group = Group('chat-{}'.format(game.uuid.hex))
    group.add(message.reply_channel)

    if game.type == Game.GameType.Running:
        message.reply_channel.send({'text': json.dumps({'action': 'joined'})})


@channel_session
def ws_message(message):
    room = message.channel_session['room']
    group = Group('chat-{}'.format(room))

    game = Game.objects.get(uuid=room)

    data = json.loads(message.content['text'])
    if data['action'] == 'join':
        if game.type == Game.GameType.Open:
            game.type = Game.GameType.Running
            game.title = game.title.replace('?', data['from'])
            game.save()

        group.send({
            'text': json.dumps({
                'action': 'joined',
                'title': game.title
            })
        })
    if data['action'] == 'play':
        group.send({'text': message.content['text']})

    if data['action'] == 'close':
        if game.type == Game.GameType.Running:
            game.type == Game.GameType.Done
            game.title = game.title.replace(
                ' vs ', ' {0} vs {1} '.format(*data['score']))
            game.save()

        group.send({'text': json.dumps({'action': 'done'})})


@channel_session
def ws_disconnect(message):
    room = message.channel_session['room']
    Group('chat-{}'.format(room)).discard(message.reply_channel)
