"""Smoke tests of the urls."""


def test_games_as_anonymous(client):
    response = client.get('/games/')
    assert response.status_code == 302


def test_games(admin_client):
    response = admin_client.get('/games/')
    assert response.status_code == 200
