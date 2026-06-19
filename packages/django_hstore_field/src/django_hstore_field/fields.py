from django.contrib.postgres.fields import HStoreField as DjangoHStoreField
from django_hstore_widget.forms import HStoreFormField
from django_hstore_widget.widgets import HStoreFormWidget


class HStoreField(DjangoHStoreField):
    """Drop-in replacement for Django's ``HStoreField`` with the custom widget.

    Overrides ``formfield()`` so that the admin and ModelForms
    automatically use :class:`~django_hstore_widget.forms.HStoreFormField`
    and :class:`~django_hstore_widget.widgets.HStoreFormWidget` -- no
    manual form configuration required.

    Example
    -------
    >>> from django.db import models
    >>> from django_hstore_field import HStoreField
    >>>
    >>> class Product(models.Model):
    ...     name = models.CharField(max_length=100)
    ...     metadata = HStoreField()
    ...     class Meta:
    ...         app_label = "example"
    """

    def formfield(self, **kwargs):
        """Return a form field class pre-configured with the custom widget.

        Parameters
        ----------
        **kwargs : dict
            Keyword arguments forwarded to the form field constructor.
            Pass ``form_class`` or ``widget`` to override the defaults.

        Returns
        -------
        ~django_hstore_widget.forms.HStoreFormField
            A form field instance wired to the hstore widget.
        """
        defaults = {
            "form_class": HStoreFormField,
            "widget": HStoreFormWidget,
        }
        defaults.update(kwargs)
        return super().formfield(**defaults)
