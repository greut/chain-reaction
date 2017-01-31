import uuid as uuidlib

from django.db import models
from django_extensions.db.models import TimeStampedModel
from djchoices import DjangoChoices, ChoiceItem


class Game(TimeStampedModel):
    """A Game between some participants."""

    # Choices
    class GameType(DjangoChoices):
        Open = ChoiceItem("O")
        Running = ChoiceItem("R")
        Unfinished = ChoiceItem("U")
        Done = ChoiceItem("D")

    # Fields
    uuid = models.UUIDField(
        db_index=True, default=uuidlib.uuid4, editable=False)
    title = models.CharField(max_length=255)
    type = models.CharField(
        max_length=1,
        choices=GameType.choices,
        validators=[GameType.validator])

    def __str__(self):
        return "{0.title}".format(self)
