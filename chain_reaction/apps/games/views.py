from django.views.generic import DetailView, ListView, FormView
from django.urls import reverse_lazy
from django.shortcuts import redirect

from .forms import JoinForm
from .models import Game


class NameMixin():
    def name(self):
        return self.request.session['name']


class JoinView(FormView):
    template_name = "join.html"
    form_class = JoinForm
    success_url = reverse_lazy('game-list')

    def form_valid(self, form):
        self.request.session['name'] = form.cleaned_data['name']
        return super(JoinView, self).form_valid(form)


def game_create(request):
    game = Game.objects.create(
        title="{0} vs ?".format(request.session['name']),
        type=Game.GameType.Open)

    request.session['game'] = game.uuid.hex
    return redirect('game-detail', uuid=game.uuid.hex)


class GameDetailView(DetailView, NameMixin):
    template_name = "game.html"
    model = Game

    def is_owner(self):
        return self.request.session.get('game', None) == self.kwargs['uuid']

    def get_object(self):
        return Game.objects.get(uuid=self.kwargs['uuid'])


class GameListView(ListView, NameMixin):
    template_name = "games.html"
    model = Game
    queryset = Game.objects.all()
