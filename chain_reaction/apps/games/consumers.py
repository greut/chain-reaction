import re
import json

from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http

from django.core.urlresolvers import reverse
from django.forms.models import model_to_dict

from .models import Game


@channel_session_user_from_http
def ws_connect(message):
    message.reply_channel.send({'accept': True})
    kind, room = message.content['path'].rsplit('/', 2)[1:]

    print(room, message.content['path'])
    if re.match(r'^[0-9]+$', room):
        game = Game.objects.get(pk=room)
    else:
        game = Game.objects.get(uuid=room)

    if game:
        message.channel_session['room'] = game.pk
        group = Group('chat-{}'.format(game.pk))
        group.add(message.reply_channel)

        if game.type == Game.GameType.Running:
            message.reply_channel.send({
                'text': json.dumps({
                    'action': 'joined'
                })
            })
    else:
        print("no game", game)


@channel_session_user
def ws_message(message):
    room = message.channel_session.get('room')
    if not room:
        print("no room")
        return

    group = Group('chat-{}'.format(room))

    game = Game.objects.get(pk=room)

    data = json.loads(message.content['text'])
    if data['action'] == 'join':
        if game.join(message.user):
            game.save()

            group.send({
                'text':
                json.dumps({
                    'action':
                    'joined',
                    'url':
                    reverse('game-play', kwargs={"uuid": str(game.uuid)})
                })
            })
        else:
            group.send({'text': json.dumps({'action': 'waiting'})})

    elif data['action'] == 'start':
        group.send({
            'text':
            json.dumps({
                'action':
                'start',
                'plays': [
                    model_to_dict(play, fields=('turn', 'x', 'y'))
                    for play in game.play_set.order_by('turn')
                ]
            })
        })

    elif data['action'] == 'play':
        # TODO: add some kind of fact checking.
        game.play_set.create(turn=data['tick'], x=data['x'], y=data['y'])

        group.send({'text': message.content['text']})

    elif data['action'] == 'score':
        play = game.play_set.get(turn=data['tick'])
        # TODO: add some kind of fact checking.
        play.first_score = data['score'][0]
        play.second_score = data['score'][1]
        play.save()

    elif data['action'] == 'close':
        if game.type == Game.GameType.Running:
            game.type = Game.GameType.Done
            game.save()

        group.send({
            'text':
            json.dumps({
                'action': 'done',
                'url': reverse('game-detail', kwargs={"pk": game.pk})
            })
        })


@channel_session_user
def ws_disconnect(message):
    room = message.channel_session.get('room')
    if not room:
        print("no room")
        return
    Group('chat-{}'.format(room)).discard(message.reply_channel)
