import re
import json
import logging

from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http

from django.core.urlresolvers import reverse
from django.forms.models import model_to_dict

from .models import Game

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler())


def get_group_and_game(message):
    room = message.channel_session.get('room')
    if room:
        game = Game.objects.get(pk=room)
    else:
        _, room = message.content['path'].rsplit('/', 2)[1:]

        if re.match(r'^[0-9]+$', room):
            game = Game.objects.get(pk=room)
        else:
            game = Game.objects.get(uuid=room)

        room = game.pk

    message.channel_session['room'] = room

    group = Group('chat-{0}'.format(room))

    return group, game


def handle_control(message, payload):
    group, game = get_group_and_game(message)

    if payload['action'] == 'join':
        if game.join(message.user):
            game.save()

            group.send({
                'text':
                json.dumps({
                    'stream': 'control',
                    'payload': {
                        'action':
                        'joined',
                        'url':
                        reverse('game-play', kwargs={"uuid": str(game.uuid)})
                    }
                })
            })
        else:
            message.reply_channel.send({
                'text':
                json.dumps({
                    'stream': 'control',
                    'payload': {
                        'action': 'waiting'
                    }
                })
            })

    if payload['action'] == 'start':
        message.reply_channel.send({
            'text':
            json.dumps({
                'stream': 'control',
                'payload': {
                    'action':
                    'start',
                    'plays': [
                        model_to_dict(play, fields=('turn', 'x', 'y'))
                        for play in game.play_set.order_by('turn')
                    ]
                }
            })
        })

    if payload['action'] == 'close':
        if game.type == Game.GameType.Running:
            game.type = Game.GameType.Done
            game.save()

        group.send({
            'text':
            json.dumps({
                'stream': 'control',
                'payload': {
                    'action': 'done',
                    'url': reverse('game-detail', kwargs={"pk": game.pk})
                }
            })
        })


def handle_play(message, payload):
    group, game = get_group_and_game(message)

    # TODO: add some kind of fact checking.
    game.play_set.create(turn=payload['tick'], x=payload['x'], y=payload['y'])

    group.send({'text': json.dumps({'stream': 'play', 'payload': payload})})


def handle_score(message, payload):
    group, game = get_group_and_game(message)

    play = game.play_set.get(turn=payload['tick'])
    # TODO: add some kind of fact checking.
    play.first_score, play.second_score = payload['score']
    play.save()

    message.reply_channel.send({
        'text':
        json.dumps({
            'stream': 'control',
            'payload': {
                'action': 'info',
                'message': 'score saved'
            }
        })
    })


streams = {
    'control': handle_control,
    'play': handle_play,
    'score': handle_score
}


@channel_session_user_from_http
def ws_connect(message):
    message.reply_channel.send({'accept': True})

    group, game = get_group_and_game(message)

    if game:
        logger.info('accept game: %s', game)

        group.add(message.reply_channel)

        if game.type in (Game.GameType.Open, Game.GameType.Running):
            message.reply_channel.send({
                'text':
                json.dumps({
                    'stream': 'control',
                    'payload': {
                        'action': 'joined'
                    }
                })
            })
    else:
        message.reply_channel.send({
            'text':
            json.dumps({
                'stream': 'control',
                'playload': {
                    'action': 'error',
                    'message': 'no game'
                }
            })
        })
        message.reply_channel.send({'accept': True})
        logger.error("No game")


@channel_session_user
def ws_message(message):
    data = json.loads(message.content['text'])
    logger.debug("%s: %s", data['stream'], data['payload'])
    return streams[data['stream']](message, data['payload'])


@channel_session_user
def ws_disconnect(message):
    group, game = get_group_and_game(message)
    logger.info('disconnect game: %s', game)
    group.discard(message.reply_channel)
