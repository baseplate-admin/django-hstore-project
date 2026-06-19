Django HStore Project
=====================

.. iconify:: fa6-brands:python
.. iconify:: mdi:language-django

A monorepo for the Django HStore ecosystem -- human-friendly PostgreSQL hstore
support for Django admin.

Packages
--------

.. list-table::
   :widths: 25 45 30
   :header-rows: 1

   * - Package
     - Description
     - Install
   * - `django-hstore-widget <api/widget.html>`__
     - Custom widget for editing hstore data in Django admin
     - ``pip install django-hstore-widget``
   * - `django-hstore-field <api/field.html>`__
     - Drop-in HStoreField with auto-wired widget
     - ``pip install django-hstore-field``

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

The widget is auto-wired -- no form configuration needed.

Contents
--------

.. toctree::
   :maxdepth: 2
   :caption: User Guide

   docs/user-guide/installation.md
   docs/user-guide/quickstart.md
   docs/user-guide/hstore-vs-jsonb.md
   docs/user-guide/best-practices.md

.. toctree::
   :maxdepth: 2
   :caption: Developer Guide

   docs/developer-guide/architecture.md
   docs/developer-guide/contributing.md
   docs/developer-guide/frontend-build.md

.. toctree::
   :maxdepth: 2
   :caption: API Reference

   api/widget
   api/field
