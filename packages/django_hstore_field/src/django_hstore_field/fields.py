from django.contrib.postgres.fields import HStoreField as DjangoHStoreField
from django_hstore_widget.forms import HStoreFormField
from django_hstore_widget.widgets import HStoreFormWidget


class HStoreField(DjangoHStoreField):
    def formfield(self, **kwargs):
        defaults = {
            "form_class": HStoreFormField,
            "widget": HStoreFormWidget,
        }
        defaults.update(kwargs)
        return super().formfield(**defaults)
