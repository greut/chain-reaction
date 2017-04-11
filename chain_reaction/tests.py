"""Tests for the basic pages."""


def test_login(client):
    response = client.get('/accounts/login/')
    assert response.status_code == 200


def test_register(client):
    response = client.get('/accounts/register/')
    assert response.status_code == 200


def test_google(client):
    response = client.get('/login/google-oauth2/')
    assert response.status_code == 302


def test_facebook(client):
    response = client.get('/login/facebook/')
    assert response.status_code == 302


def test_github(client):
    response = client.get('/login/github/')
    assert response.status_code == 302
