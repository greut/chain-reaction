from django.template import Library

register = Library()


@register.simple_tag
def game_num(game, player):
    return game.num(player)
