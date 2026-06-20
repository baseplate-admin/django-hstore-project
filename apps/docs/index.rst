Django HStore Project
=====================

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
   * - `django-hstore-widget <https://pypi.org/project/django-hstore-widget/>`__
     - Custom widget for editing hstore data in Django admin
     - ``pip install django-hstore-widget``
   * - `django-hstore-field <https://pypi.org/project/django-hstore-field/>`__
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
   docs/user-guide/quickstart.rst
   docs/user-guide/best-practices.md

.. toctree::
   :maxdepth: 2
   :caption: Technical

   docs/technical/index

.. toctree::
   :maxdepth: 2
   :caption: Developer Guide

   docs/developer-guide/architecture.rst
   docs/developer-guide/contributing.rst
   docs/developer-guide/frontend-build.md
   docs/playground

.. toctree::
   :maxdepth: 2
   :caption: API Reference

   api/widget
   api/field

.. toctree::
   :maxdepth: 2
   :caption: LLM Context

   docs/llms/index.md

.. toctree::
   :maxdepth: 2
   :caption: Legal

   docs/license
