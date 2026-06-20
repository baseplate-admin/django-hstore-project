HStore vs JSONB
===============

PostgreSQL offers two flexible data types for key-value and document storage.
This page compares them to help you choose the right one.

Quick Decision
--------------

Use **HStore** when your data is flat key-value pairs, which is most metadata,
tags, and product attributes. Use **JSONB** when you need nested structures,
mixed value types, or containment queries.

Feature Matrix
--------------

.. grid:: 3
   :gutter: 1

   .. grid-item:: Feature
      :columns: 12
      :child-align: center

      +------------------+----------+---------+
      | Feature          | HStore   | JSONB   |
      +==================+==========+=========+
      | Flat key-value   | Yes      | Yes     |
      +------------------+----------+---------+
      | Nested structs   | No       | Yes     |
      +------------------+----------+---------+
      | Non-string vals  | No       | Yes     |
      +------------------+----------+---------+
      | Simple admin UI  | Yes      | No      |
      +------------------+----------+---------+
      | Easy validation  | Yes      | No      |
      +------------------+----------+---------+
      | Containment      | No       | Yes     |
      +------------------+----------+---------+
      | Smaller storage  | Yes      | No      |
      +------------------+----------+---------+
      | GIN indexes      | Yes      | Yes     |
      +------------------+----------+---------+

Storage
-------

HStore is more compact because it stores flat key-value pairs without structural
overhead:

.. note::

   - HStore: ~200 bytes for 10 key-value pairs
   - JSONB:  ~350 bytes for the same data (structure overhead)

Query Performance
-----------------

HStore
~~~~~~

.. tabs::

   .. tab:: :iconify:`logos:django` Django ORM

      .. code-block:: python

         # Find all red products
         Product.objects.filter(attributes__color='red')

         # Products with a size attribute
         Product.objects.filter(attributes__has_key='size')

   .. tab:: :iconify:`mdi:database` SQL

      .. code-block:: sql

         -- Check if a key exists
         SELECT * FROM products WHERE attributes ? 'size';

         -- Get a specific value
         SELECT attributes->'color' FROM products;

         -- Query by key-value pair
         SELECT * FROM products WHERE attributes->'color' = 'red';

JSONB
~~~~~

.. tabs::

   .. tab:: :iconify:`logos:django` Django ORM

      .. code-block:: python

         # Nested value access
         Config.objects.filter(settings__cache__ttl__gt=300)

         # Containment query
         Config.objects.filter(settings__contains={"enabled": True})

   .. tab:: :iconify:`mdi:database` SQL

      .. code-block:: sql

         -- Nested value access
         SELECT * FROM configs WHERE settings->'cache'->>'ttl' > 300;

         -- Containment query
         SELECT * FROM configs WHERE settings @> '{"enabled": true}';

Indexing
--------

Both HStore and JSONB support GIN indexes for fast lookups:

.. code-block:: sql

   CREATE INDEX products_attrs_gin ON products USING GIN (attributes);
   CREATE INDEX configs_settings_gin ON configs USING GIN (settings);

Summary
-------

.. tip::

   Choose HStore for simple metadata, tags, and product attributes. Choose
   JSONB for nested configurations, API responses, and document storage.
