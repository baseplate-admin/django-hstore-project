# Installation

## Requirements

- Python 3.10+
- Django 5.0+
- PostgreSQL 14+
- Modern browsers (Chrome 112+, Firefox 117+, Safari 16.5+)

## Option A: django-hstore-field (Recommended)

```bash
pip install django-hstore-field
```

This installs django-hstore-widget as a dependency.

```python
# settings.py
INSTALLED_APPS = [
    ...,
    'django_hstore_widget',
    'django_hstore_field',
    ...,
]
```

## Option B: django-hstore-widget (Lower Level)

```bash
pip install django-hstore-widget
```

```python
# settings.py
INSTALLED_APPS = [
    ...,
    'django_hstore_widget',
    ...,
]
```

## Database Setup

Run migrations to enable the hstore extension:

```bash
python manage.py migrate
```

This applies the `HStoreExtension()` migration automatically.
