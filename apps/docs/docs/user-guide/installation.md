# Installation

Get up and running with django-hstore-project in minutes.

## Requirements

- Python 3.10+
- Django 5.0+
- PostgreSQL 14+
- Modern browsers (Chrome 112+, Firefox 117+, Safari 16.5+)

## Install django-hstore-field

```{eval-rst}
.. tabs::

   .. tab:: pip

      .. termynal::
         $ pip install django-hstore-field
         -->
         Collecting django-hstore-field
         Collecting django-hstore-widget
         Installing collected packages...
         Successfully installed django-hstore-field django-hstore-widget

   .. tab:: uv

      .. termynal::
         $ uv pip install django-hstore-field
         -->
         Collecting django-hstore-field
         Collecting django-hstore-widget
         Installing collected packages...
         Successfully installed django-hstore-field django-hstore-widget
```

## Configure

Add both packages to your ``INSTALLED_APPS``:

```python
# settings.py
INSTALLED_APPS = [
    ...,
    'django_hstore_widget',
    'django_hstore_field',
    ...,
]
```

## Run Migrations

```{eval-rst}
.. termynal::
   $ python manage.py migrate
   -->
   Operations to perform:
     Apply all migrations: admin, auth, contenttypes, sessions
   Running migrations:
     Applying contenttypes.0001_initial... OK
     Applying auth.0001_initial... OK
   All migrations completed.
```

This enables the PostgreSQL hstore extension automatically.

## Next

Head over to the :doc:`quickstart` to use HStore fields in your models.
