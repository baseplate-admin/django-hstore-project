# django-hstore-field API

## HStoreField

```python
from django_hstore_field import HStoreField
```

Drop-in replacement for Django's built-in `HStoreField` that auto-wires the widget.

```python
from django.db import models
from django_hstore_field import HStoreField

class MyModel(models.Model):
    metadata = HStoreField()
```

### How It Works

Overrides `formfield()` to inject:
- `form_class`: `HStoreFormField` from django-hstore-widget
- `widget`: `HStoreFormWidget` from django-hstore-widget

This means you get the widget in admin without configuring forms manually.

### Requirements

- `django_hstore_widget` must be in `INSTALLED_APPS`
- The hstore extension must be enabled (migration dependency)
