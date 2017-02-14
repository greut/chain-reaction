import uuid as uuidlib

from django.conf import settings
from django.db import models
from django_extensions.db.models import TimeStampedModel
from djchoices import DjangoChoices, ChoiceItem


class Game(TimeStampedModel):
    """A Game between some participants."""

    class GameType(DjangoChoices):
        Open = ChoiceItem("O")
        Running = ChoiceItem("R")
        Unfinished = ChoiceItem("U")
        Done = ChoiceItem("D")

    uuid = models.UUIDField(
        db_index=True, default=uuidlib.uuid4, editable=False)
    type = models.CharField(
        max_length=1,
        choices=GameType.choices,
        validators=[GameType.validator])
    first_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='first_game')
    second_player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='second_game')

    def __str__(self):
        return "{0.first_player} vs {0.second_player}".format(self)


class Play(TimeStampedModel):
    """A play in a game."""

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    first_score = models.PositiveSmallIntegerField()
    second_score = models.PositiveSmallIntegerField()

    def __str__(self):
        "{0.first_score} - {0.second_score} @ ({0.x},{0.y})".format(self)
