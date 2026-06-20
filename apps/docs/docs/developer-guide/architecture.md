# Architecture

## Overview

```{eval-rst}
.. mermaid::

   graph LR
        A[django_hstore_field] --> B[django_hstore_widget]
        B --> C[Django runtime]
        B --> D[Lit frontend]
```

## django-hstore-field

Drop-in HStoreField that auto-wires the widget. No form configuration needed.

## django-hstore-widget

Lit-based frontend component with Django admin integration. Handles rendering,
validation, and media registration.
