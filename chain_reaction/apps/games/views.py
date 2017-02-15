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
    queryset = Game.objects.all()
