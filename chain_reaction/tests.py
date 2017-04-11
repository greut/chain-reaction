"""Tests for the basic pages."""

import pytest


@pytest.fixture()
def admin_user(db, django_user_model):
    UserModel = django_user_model
    try:
        user = UserModel._default_manager.get(name="admin")
    except UserModel.DoesNotExist:
        user = UserModel._default_manager.create_superuser(
            name="admin", email="admin.admin@admin.org", password="admin")

    return user


@pytest.fixture()
def admin_client(db, admin_user):
    from django.test.client import Client

    client = Client()
    client.login(name=admin_user.name, password="admin")
    return client


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


# Login


def test_google(client):
    response = client.get('/login/google-oauth2/')
    assert response.status_code == 302


def test_facebook(client):
    response = client.get('/login/facebook/')
    assert response.status_code == 302


def test_github(client):
    response = client.get('/login/github/')
    assert response.status_code == 302


# Admin


def test_admin(admin_client):
    response = admin_client.get('/admin/')
    assert response.status_code == 200
