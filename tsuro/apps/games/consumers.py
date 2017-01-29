from channels import Group
from channels.sessions import channel_session


@channel_session
def ws_connect(message):
    message.reply_channel.send({'accept': True})
    room = message.content['path'].rsplit('/', 1)[1]
    message.channel_session['room'] = room
    Group('chat-{}'.format(room)).add(message.reply_channel)


@channel_session
def ws_message(message):
    room = message.channel_session['room']
    Group('chat-{}'.format(room)).send({'text': message.content['text']})


@channel_session
def ws_disconnect(message):
    room = message.channel_session['room']
    Group('chat-{}'.format(room)).discard(message.reply_channel)
