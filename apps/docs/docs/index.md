# Django HStore Project

A monorepo for the Django HStore ecosystem — human-friendly PostgreSQL hstore support for Django admin.

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| [django-hstore-widget](api/widget.md) | Custom widget for editing hstore data in Django admin | `pip install django-hstore-widget` |
| [django-hstore-field](api/field.md) | Drop-in HStoreField with auto-wired widget | `pip install django-hstore-field` |

## Quick Start

For new projects, use **django-hstore-field**:

```python
# models.py
from django.db import models
from django_hstore_field import HStoreField

class Product(models.Model):
    name = models.CharField(max_length=100)
    metadata = HStoreField()
```

The widget is auto-wired — no form configuration needed.

## Why HStore?

HStore is PostgreSQL's key-value data type. Choose HStore when you need:
- Simple flat key-value metadata
- Smaller storage footprint than JSONB
- Easy validation and admin UI
- Fast key-based lookups

See [HStore vs JSONB](user-guide/hstore-vs-jsonb.md) for a detailed comparison.
