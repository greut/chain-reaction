from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _


def validate_username(value):
    """Validate the username to avoir the ?."""
    if '?' in value:
        raise ValidationError(
            _('%(value)s is not a valid username'), params={'value': value})


class JoinForm(forms.Form):
    name = forms.CharField(
        min_length=3,
        max_length=255,
        required=True,
        validators=[validate_username])
