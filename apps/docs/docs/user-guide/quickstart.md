# Quick Start

Get up and running with django-hstore-project in under a minute.

## Create a Model

Add an HStore field to any model:

```python
# models.py
from django.db import models
from django_hstore_field import HStoreField

class Product(models.Model):
    name = models.CharField(max_length=100)
    metadata = HStoreField()
```

That's it. The widget is auto-wired, no form configuration needed.

## Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

This enables the PostgreSQL hstore extension automatically.

## Register in Admin

```python
# admin.py
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    pass
```

Visit your admin page and you'll see the HStore widget with a clean key-value
interface. Each key-value pair is editable inline. Add, remove, and modify pairs
as needed.

## With Custom Keys

Define explicit keys to get labeled form fields instead of the free-form editor:

```python
from django import forms
from django_hstore_field import HStoreField

class Product(models.Model):
    name = models.CharField(max_length=100)
    metadata = HStoreField(
        keys=[
            ('color', {'widget': forms.TextInput}),
            ('size', {'widget': forms.Select, 'choices': SIZE_CHOICES}),
            ('material', {'widget': forms.TextInput}),
        ],
    )
```

Each key becomes a proper form field with validation, widgets, and labels.

## What's Next

```{eval-rst}
- :doc:`../user-guide/installation` - Detailed installation options
- :doc:`../technical/hstore-vs-jsonb` - When to use HStore vs JSONB
- :doc:`../user-guide/best-practices` - Tips for production use
```
