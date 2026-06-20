Django HStore Project
=====================

A monorepo for the Django HStore ecosystem, human-friendly PostgreSQL hstore
support for Django admin.

Packages
--------

.. grid:: 2
   :gutter: 2

   .. grid-item-card:: django-hstore-widget
      :columns: 12 12 6 6
      :class-card: intro-card
      :shadow: md
      :link: https://pypi.org/project/django-hstore-widget/
      :link-type: url

      Custom widget for editing hstore data in Django admin. Built with Lit
      and TypeScript for a responsive key-value editor.

      .. code-block:: bash

         pip install django-hstore-widget

   .. grid-item-card:: django-hstore-field
      :columns: 12 12 6 6
      :class-card: intro-card
      :shadow: md
      :link: https://pypi.org/project/django-hstore-field/
      :link-type: url

      Drop-in HStoreField with auto-wired widget. Zero configuration for new
      projects.

      .. code-block:: bash

         pip install django-hstore-field

Quick Start
-----------

For new projects, use **django-hstore-field**:

.. code-block:: python

   # models.py
   from django.db import models
   from django_hstore_field import HStoreField

   class Product(models.Model):
       name = models.CharField(max_length=100)
       metadata = HStoreField()

The widget is auto-wired, no form configuration needed.

Contents
--------

.. toctree::
   :maxdepth: 2
   :caption: User Guide

   docs/user-guide/installation.md
   docs/user-guide/quickstart.md
   docs/user-guide/best-practices.md

.. toctree::
   :maxdepth: 2
   :caption: Technical

   docs/technical/index.md

.. toctree::
   :maxdepth: 2
   :caption: Developer Guide

   docs/developer-guide/architecture.md
   docs/developer-guide/contributing.md
   docs/developer-guide/frontend-build.md
   docs/playground.md

.. toctree::
   :maxdepth: 2
   :caption: API Reference

   api/widget.rst
   api/field.rst

.. toctree::
   :maxdepth: 2
   :caption: LLM Context

   docs/llms/index.md

.. toctree::
   :maxdepth: 2
   :caption: Legal

   docs/license
