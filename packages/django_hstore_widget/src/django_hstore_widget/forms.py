import json
import logging

from django.contrib.postgres.forms import HStoreField

from .widgets import HStoreFormWidget


logger = logging.getLogger("django_hstore_widget")


class HStoreFormField(HStoreField):
    widget = HStoreFormWidget

    def clean(self, value={}):
        return json.loads(value)
