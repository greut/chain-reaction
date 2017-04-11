"""Smoke test of the accounts URLs."""


def test_login(client):
    response = client.get('/accounts/login/')
    assert response.status_code == 200


def test_register(client):
    response = client.get('/accounts/register/')
    assert response.status_code == 200


def test_password_reset(client):
    response = client.get('/accounts/password/reset/')
    assert response.status_code == 200


def test_password_change_anonymous(client):
    response = client.get('/accounts/password/change/')
    assert response.status_code == 302


def test_password_change(admin_client):
    response = admin_client.get('/accounts/password/change/')
    assert response.status_code == 200
