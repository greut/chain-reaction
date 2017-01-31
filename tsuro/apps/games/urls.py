from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.JoinView.as_view(), name='join'),
    url(r'^game/(?P<uuid>[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12})$',
        views.GameDetailView.as_view(),
        name='game-detail'),
    url(r'^game/create$', views.game_create, name='game-create'),
    url(r'^games/$', views.GameListView.as_view(), name='game-list'),
]
