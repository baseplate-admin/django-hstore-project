# django-hstore-field

Drop-in HStore field with auto-wired widget for Django admin.

[![Pypi Badge](https://img.shields.io/pypi/v/django-hstore-field.svg)](https://pypi.org/project/django-hstore-field/)

## Installation

```bash
pip install django-hstore-field
```

Add both packages to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...,
    'django_hstore_widget',
    'django_hstore_field',
    ...
]
```

## Usage

```python
# models.py
from django.db import models
from django_hstore_field import HStoreField

class MyModel(models.Model):
    metadata = HStoreField()
```

That's it — the widget is auto-wired. No form configuration needed.
