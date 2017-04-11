from django.contrib import admin

from .models import Game, Play


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_player', 'second_player', 'type', 'uuid')


@admin.register(Play)
class PlayAdmin(admin.ModelAdmin):
    list_display = ('turn', 'x', 'y', 'first_score', 'second_score')
