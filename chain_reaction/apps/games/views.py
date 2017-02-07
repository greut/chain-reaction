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
    game = Game.objects.create(
        title="{0} vs ?".format(request.user.name), type=Game.GameType.Open)

    request.session['game'] = game.uuid.hex
    return redirect('game-detail', uuid=game.uuid.hex)


class GameDetailView(LoginRequiredMixin, DetailView):
    template_name = "game.html"
    model = Game

    def is_owner(self):
        return self.request.session.get('game', None) == self.kwargs['uuid']

    def get_object(self):
        return Game.objects.get(uuid=self.kwargs['uuid'])


class GameListView(LoginRequiredMixin, ListView):
    template_name = "games.html"
    model = Game
    queryset = Game.objects.all()
