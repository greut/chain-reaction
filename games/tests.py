import pytest

from .models import Game


@pytest.fixture
def john(django_user_model):
    User = django_user_model
    return User(name="John", email="john.doe@example.org")


@pytest.fixture
def alice(django_user_model):
    User = django_user_model
    return User(name="Alice", email="alice.doe@example.org")


@pytest.mark.django_db
def test_join_second(alice, john):
    game = Game(first_player=john)
    game.join(alice)
    assert 0 == game.num(john)
    assert 1 == game.num(alice)


@pytest.mark.django_db
def test_join_first(alice, john):
    game = Game(second_player=john)
    game.join(alice)
    assert 0 == game.num(alice)
    assert 1 == game.num(john)
