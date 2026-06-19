# Best Practices

## When to Use HStore

HStore excels at flat key-value metadata. Use it when:

- You need simple string-based key-value pairs
- Storage efficiency matters more than nested structures
- You want a user-friendly admin interface without custom widgets
- Your data doesn't require complex querying with containment operators

## Field Organization

```python
from django_hstore_field import HStoreField

class Product(models.Model):
    # Use HStore for metadata that varies by item
    attributes = HStoreField(
        default=dict,  # Provide a sensible default
        blank=True,    # Allow empty for flexibility
    )
```

## Migration Safety

When adding HStore fields to existing models:

1. Always provide a `default` value
2. Test migrations in a non-production environment first
3. The hstore extension must be enabled before creating the field

## Performance Tips

- Index specific keys using PostgreSQL expressions when querying frequently
- Keep individual key-value pairs under 1KB for optimal storage
- Use HStore for metadata, not for primary data that requires complex joins

## Admin Configuration

```python
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "metadata_summary")

    def metadata_summary(self, obj):
        return f"{len(obj.attributes)} keys" if obj.attributes else "empty"
```
