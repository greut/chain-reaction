"""Smoke tests of the social login URLs."""


def test_google(client):
    response = client.get('/login/google-oauth2/')
    assert response.status_code == 302


def test_facebook(client):
    response = client.get('/login/facebook/')
    assert response.status_code == 302


def test_github(client):
    response = client.get('/login/github/')
    assert response.status_code == 302
