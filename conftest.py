"""Global set of fixtures."""

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
