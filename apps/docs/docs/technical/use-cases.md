# Use Cases

Real-world scenarios for choosing between HStore and JSONB in your Django
application.

## Use HStore When

### Product Attributes

Products have varying attributes like color, size, material that don't warrant
dedicated columns. HStore stores them as flat key-value pairs with a clean admin
interface.

```python
from django_hstore_field import HStoreField

class Product(models.Model):
    name = models.CharField(max_length=200)
    attributes = HStoreField(
        default=dict,
        blank=True,
    )
```

```{eval-rst}
.. tabs::

   .. tab:: Django ORM

      .. code-block:: python

         # Find all red products
         Product.objects.filter(attributes__color='red')

         # Products with a size attribute
         Product.objects.filter(attributes__has_key='size')

   .. tab:: SQL

      .. code-block:: sql

         SELECT * FROM myapp_product WHERE attributes->'color' = 'red';
         SELECT * FROM myapp_product WHERE attributes ? 'size';
```

### User Preferences

Store user settings like timezone, language, notification preferences as
flexible key-value pairs:

```python
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    preferences = HStoreField(
        default=dict,
    )
```

### Content Metadata

Tags, categories, and custom fields for articles, media, or any content model:

```python
class Article(models.Model):
    title = models.CharField(max_length=300)
    metadata = HStoreField(
        default=dict,
        blank=True,
    )
```

## Use JSONB When

### Nested Configuration

Application settings with hierarchical structure:

```python
class SiteConfig(models.Model):
    settings = models.JSONField(default=dict)
    # {
    #     "email": {"from_addr": "noreply@example.com", "enabled": True},
    #     "cache": {"backend": "redis", "ttl": 300},
    # }
```

```{eval-rst}
.. tabs::

   .. tab:: Django ORM

      .. code-block:: python

         # Query nested values
         SiteConfig.objects.filter(settings__email__enabled=True)

   .. tab:: SQL

      .. code-block:: sql

         SELECT * FROM myapp_siteconfig WHERE settings->'email'->>'enabled' = 'true';
```

### API Response Cache

Store and query nested API responses:

```python
class CachedResponse(models.Model):
    endpoint = models.CharField(max_length=500)
    response = models.JSONField()
    cached_at = models.DateTimeField(auto_now_add=True)
```

### Search Facets

Dynamic filter options with mixed types:

```python
class SearchFacet(models.Model):
    name = models.CharField(max_length=100)
    options = models.JSONField(default=list)
    # [
    #     {"label": "Under $50", "value": 50, "type": "price_max"},
    #     {"label": "In Stock", "value": True, "type": "boolean"},
    # ]
```

## Guidelines

```{eval-rst}
.. list-table::
   :widths: 40 30 30
   :header-rows: 1

   * - Scenario
     - HStore
     - JSONB
   * - Product attributes
     - Yes
     -
   * - User preferences
     - Yes
     -
   * - Content tags / metadata
     - Yes
     -
   * - Nested app configuration
     -
     - Yes
   * - API response caching
     -
     - Yes
   * - Mixed-type form data
     -
     - Yes
   * - Document storage
     -
     - Yes
```

:::{tip}
When in doubt, start with HStore. It's simpler, more compact, and gives you
a better admin experience. Migrate to JSONB only when you genuinely need
nested structures or mixed value types.
:::
