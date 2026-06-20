Frontend Build Pipeline
=======================

Overview
--------

The widget frontend is built with Vite and TypeScript, producing a single
IIFE bundle loaded by Django admin.

Build Steps
-----------

1. Vite bundles ``src/frontend/index.ts`` into ``dist/components/django-hstore-widget.js``
2. ``scripts/copy.ts`` copies the bundle to ``src/django_hstore_widget/static/admin/js/django_hstore_widget/``
3. Django serves the bundle via static files

Configuration
-------------

- ``vite.config.ts`` - Entry point, output, aliases, dev server
- ``tsconfig.json`` - TypeScript compiler options, path aliases

Path Aliases
------------

.. grid:: 2
   :gutter: 1

   .. grid-item::
      :columns: 12 12 6 6

      .. code-block:: text

         $lib/*

      Resolves to ``src/frontend/lib/*``

   .. grid-item::
      :columns: 12 12 6 6

      .. code-block:: text

         $store/*

      Resolves to ``src/frontend/stores/*``

   .. grid-item::
      :columns: 12 12 6 6

      .. code-block:: text

         $mappping/*

      Resolves to ``src/frontend/mappings/*``

   .. grid-item::
      :columns: 12 12 6 6

      .. code-block:: text

         $components/*

      Resolves to ``src/frontend/components/*``

Development
-----------

.. code-block:: bash

   # Start dev server
   npm run dev

   # The dev server runs on port 9100 with HMR
