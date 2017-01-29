from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.JoinView.as_view(), name='join'),
    url(r'^games/$', views.GamesView.as_view(), name='games'),
]
