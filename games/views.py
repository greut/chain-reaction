import random

from django.views.generic import DetailView, ListView, TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect

from .models import Game


class JoinView(TemplateView):
    template_name = "join.html"

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            return redirect('game-list')
        return super(JoinView, self).dispatch(request, *args, **kwargs)


@login_required()
def game_create(request):
    players = [request.user, None]
    random.shuffle(players)
    game = Game.objects.create(
        first_player=players[0],
        second_player=players[1],
        type=Game.GameType.Open)

    return redirect('game-detail', pk=game.pk)


class GameDetailView(LoginRequiredMixin, DetailView):
    template_name = "game.html"
    model = Game

    def chart(self):
        game = self.get_object()
        if game.type == Game.GameType.Done:
            x = []
            y1 = []
            y2 = []
            for i, play in enumerate(game.play_set.order_by('id').all()):
                x.append(i + 1)
                y1.append(play.first_score)
                y2.append(play.second_score)
            return {
                "type": "lineChart",
                "data": {
                    "x": x,
                    "name1": game.first_player.name,
                    "y1": y1,
                    "name2": game.second_player.name,
                    "y2": y2
                },
                "extra": {
                    "x_is_date": False,
                    "x_axis_format": "d",
                    "y_is_date": False,
                    "y_axis_format": "d",
                    "jquery_on_ready": True,
                    "use_interactive_guideline": True
                }
            }
        return None

    def dispatch(self, request, *args, **kwargs):
        game = self.get_object()
        if ((game.first_player == request.user or
             game.second_player == request.user) and
                game.type == Game.GameType.Running):
            return redirect('game-play', uuid=str(game.uuid))
        return super(GameDetailView, self).dispatch(request, *args, **kwargs)


class GamePlayView(LoginRequiredMixin, DetailView):
    template_name = "game-play.html"
    model = Game

    def dispatch(self, request, *args, **kwargs):
        game = self.get_object()
        if ((game.first_player != request.user and
             game.second_player != request.user) or
                game.type != Game.GameType.Running):
            return redirect('game-detail', pk=game.pk)
        return super(GamePlayView, self).dispatch(request, *args, **kwargs)

    def get_object(self):
        return Game.objects.get(uuid=self.kwargs['uuid'])


class GameListView(LoginRequiredMixin, ListView):
    template_name = "games.html"
    model = Game
    ordering = '-id'

    def open_games(self):
        qs = self.get_queryset()
        return qs.filter(type=Game.GameType.Open)

    def running_games(self):
        return self.get_queryset().filter(type=Game.GameType.Running)

    def done_games(self):
        return self.get_queryset().filter(type=Game.GameType.Done)
