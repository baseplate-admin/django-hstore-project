import json
import logging

from django.contrib.postgres.forms import HStoreField

from .widgets import HStoreFormWidget

logger = logging.getLogger("django_hstore_widget")


class HStoreFormField(HStoreField):
    """Form field that uses :class:`~django_hstore_widget.widgets.HStoreFormWidget`.

    Extends Django's built-in ``HStoreField`` to inject the custom
    widget and override ``clean()`` so incoming values are parsed
    through ``json.loads``.

    Example
    -------
    >>> from django_hstore_widget.forms import HStoreFormField
    >>> field = HStoreFormField()
    >>> field.widget.__class__.__name__
    'HStoreFormWidget'
    """

    widget = HStoreFormWidget

    def clean(self, value):
        """Parse the raw form value into a Python dict.

        Parameters
        ----------
        value : str or dict
            The raw value submitted by the form.

        Returns
        -------
        dict
            The deserialized key-value mapping.
        """
        return json.loads(value)
