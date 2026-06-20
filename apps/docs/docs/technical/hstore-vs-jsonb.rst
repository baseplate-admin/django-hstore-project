HStore vs JSONB
===============

PostgreSQL offers two flexible data types for storing semi-structured data.
Understanding when to choose each one is key to writing efficient, maintainable
applications.

The Short Answer
----------------

Use **HStore** when your data is flat key-value pairs -- which is most metadata,
settings, and configuration. Use **JSONB** when you need nested structures, mixed
types, or document-like storage.

How They Differ
---------------

+------------------------+-------------------------+-------------------------+
| Feature                | HStore                  | JSONB                   |
+------------------------+-------------------------+-------------------------+
| Data shape             | Flat key-value pairs    | Nested documents        |
+------------------------+-------------------------+-------------------------+
| Value types            | Strings only            | Numbers, booleans,      |
|                        |                         | arrays, objects         |
+------------------------+-------------------------+-------------------------+
| Storage                | Compact text            | Binary tree structure   |
|                        | representation          |                         |
+------------------------+-------------------------+-------------------------+
| Indexing               | GiST, GIN               | GIN, GiST, B-tree       |
+------------------------+-------------------------+-------------------------+
| Queries                | Key existence, lookup   | Containment, path       |
|                        |                         | expressions             |
+------------------------+-------------------------+-------------------------+
| Admin UI               | Simple form fields      | Raw JSON textarea       |
+------------------------+-------------------------+-------------------------+
| Validation             | Straightforward         | Requires manual checks  |
+------------------------+-------------------------+-------------------------+

Why HStore for Metadata
-----------------------

Most applications store metadata as flat key-value pairs: a product's color, a
user's timezone, an article's tags. HStore is purpose-built for this exact use
case.

Smaller Storage Footprint
~~~~~~~~~~~~~~~~~~~~~~~~~

HStore stores data as a flat text representation without the overhead of JSON's
nested structure. For a typical metadata record with 10-20 keys:

.. code-block:: sql

   -- HStore: ~200 bytes for 10 key-value pairs
   -- JSONB:  ~350 bytes for the same data (structure overhead)

Simpler Queries
~~~~~~~~~~~~~~~

HStore queries are straightforward. You check for a key, get its value, or
update it:

.. tabs::

   .. tab:: Django ORM

      .. code-block:: python

         # Check if a key exists
         Product.objects.filter(metadata__has_key='color')

         # Get a specific value
         Product.objects.values_list('metadata__color', flat=True)

         # Query by key-value pair
         Product.objects.filter(metadata__category='electronics')

   .. tab:: SQL

      .. code-block:: sql

         -- Check if a key exists
         SELECT * FROM myapp_product WHERE metadata ? 'color';

         -- Get a specific value
         SELECT metadata->'color' FROM myapp_product;

         -- Query by key-value pair
         SELECT * FROM myapp_product WHERE metadata->'category' = 'electronics';

Built-in Admin Interface
~~~~~~~~~~~~~~~~~~~~~~~~

With django-hstore-field, each key becomes a form field in the Django admin. No
custom widgets, no JSON parsing, no validation headaches:

.. code-block:: python

   from django import forms
   from django.db import models
   from django_hstore_field import HStoreField

   class Product(models.Model):
       name = models.CharField(max_length=200)
       metadata = HStoreField(
           keys=[
               ('color', {'widget': forms.TextInput}),
               ('size', {'widget': forms.Select, 'choices': SIZE_CHOICES}),
               ('material', {'widget': forms.TextInput}),
           ],
       )

Each key renders as a proper form field with validation, widgets, and labels.
No raw JSON textareas.

Easier Validation
~~~~~~~~~~~~~~~~~

HStore values are strings. Validation is explicit and happens at the form level:

.. code-block:: python

   class ProductForm(forms.ModelForm):
       class Meta:
           model = Product
           fields = ['name', 'metadata']

       def clean(self):
           cleaned_data = super().clean()
           color = cleaned_data['metadata'].get('color', '')
           if color and color not in VALID_COLORS:
               raise forms.ValidationError(f'Invalid color: {color}')
           return cleaned_data

When JSONB Makes Sense
----------------------

JSONB shines when your data is inherently nested or requires complex queries:

- **Configuration files** with nested sections and sub-options
- **API responses** you store for auditing or caching
- **Document storage** where each document has its own schema
- **Mixed-type data** where some values are numbers, others are booleans

.. code-block:: python

   from django.db import models

   class AppConfig(models.Model):
       settings = models.JSONField(default=dict)
       # {
       #     "database": {"pool_size": 10, "timeout": 30},
       #     "cache": {"enabled": True, "ttl": 300},
       # }

The Trade-off
-------------

HStore gives you simplicity, smaller storage, and a clean admin interface. JSONB
gives you flexibility, nested structures, and advanced querying. For most Django
applications dealing with metadata, HStore is the pragmatic choice.

If you find yourself reaching for JSONB, ask: do I actually need nested
structures, or am I just storing a bunch of string properties? If it's the
latter, HStore will serve you better.
