Best Practices
==============

Tips and recommendations for using HStore fields effectively in production.

Keep Keys Consistent
--------------------

Use a naming convention for keys across your application. This makes querying
and maintenance easier.

.. code-block:: python

   # Good: consistent snake_case keys
   metadata = HStoreField(keys=[
       ('product_color', {'widget': forms.TextInput}),
       ('product_size', {'widget': forms.TextInput}),
   ])

   # Avoid: mixing conventions
   metadata = HStoreField(keys=[
       ('product_color', {'widget': forms.TextInput}),
       ('Size', {'widget': forms.TextInput}),
   ])

Use Explicit Keys When Possible
-------------------------------

Defining explicit keys gives you:

- Labeled form fields in the admin
- Built-in validation per key
- Widget customization per field
- IDE autocomplete for key names

.. code-block:: python

   class Product(models.Model):
       metadata = HStoreField(
           keys=[
               ('color', {'widget': forms.TextInput}),
               ('size', {'widget': forms.Select, 'choices': SIZE_CHOICES}),
           ],
       )

Index Frequently Queried Keys
-----------------------------

Add GIN indexes on HStore columns you query often:

.. code-block:: python

   from django.db import models

   class Product(models.Model):
       attributes = HStoreField()

       class Meta:
           indexes = [
               models.GinIndex(fields=['attributes'], name='product_attrs_gin'),
           ]

Handle Missing Keys Gracefully
------------------------------

HStore keys may not exist in all rows. Use ``get()`` with defaults:

.. code-block:: python

   product = Product.objects.first()
   color = product.attributes.get('color', 'default_color')

Validate Key Values
-------------------

HStore values are strings. Validate and convert them where needed:

.. code-block:: python

   from django.core.exceptions import ValidationError

   def clean(self):
       if 'price' in self.attributes:
           try:
               float(self.attributes['price'])
           except (ValueError, TypeError):
               raise ValidationError({'attributes': 'Price must be a number.'})

Consider Migration Paths
------------------------

If you anticipate needing nested data in the future, plan your migration from
HStore to JSONB early. The data formats are not directly compatible.
