from django.db import models
from django.utils.translation import ugettext_lazy as _
from authtools.models import AbstractNamedUser


class User(AbstractNamedUser):
    name = models.CharField(_('name'), max_length=255, unique=True)

    # Required for Python Social App to work properly.
    USERNAME_FIELD = 'name'
    REQUIRED_FIELDS = ['email']

    class Meta(AbstractNamedUser.Meta):
        swappable = 'AUTH_USER_MODEL'
        verbose_name = _('user')
        verbose_name_plural = _('users')
