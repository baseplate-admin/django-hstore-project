# django-hstore-widget

Human-friendly HStoreWidget for Django admin.

> [!NOTE]
> For new projects, see [django-hstore-field](../django_hstore_field/) — it auto-wires this widget.

[![Downloads](https://static.pepy.tech/badge/django-hstore-widget)](https://pepy.tech/project/django-hstore-widget)
[![Pypi Badge](https://img.shields.io/pypi/v/django-hstore-widget.svg)](https://pypi.org/project/django-hstore-widget/)

## Requirements

- Python 3.10 and up
- Django 5.0 and up
- Modern browsers (Chrome 112+, Firefox 117+, Safari 16.5+)

## Installation

```bash
pip install django-hstore-widget
```

Add to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...,
    'django_hstore_widget',
    ...
]
```

## Usage

```python
# forms.py
from django import forms
from django_hstore_widget.forms import HStoreFormField

class MyModelAdminForm(forms.ModelForm):
    my_hstore_field = HStoreFormField()

    class Meta:
        model = MyModel
```

```python
# admin.py
from django.contrib import admin
from .models import MyModel
from .forms import MyModelAdminForm

@admin.register(MyModel)
class MyModelAdmin(admin.ModelAdmin):
    form = MyModelAdminForm
```

## HStore vs JSONB

| Feature                   | HStore | JSONB |
|---------------------------|--------|-------|
| Flat key-value            | ✅     | ✅    |
| Nested structures         | ❌     | ✅    |
| Simple admin UI           | ✅     | ❌    |
| Smaller storage           | ✅     | ❌    |
