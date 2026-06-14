# django-hstore-widget API

## HStoreFormField

```python
from django_hstore_widget.forms import HStoreFormField
```

Form field class that renders hstore data with the custom widget.

- Inherits from `django.contrib.postgres.forms.HStoreField`
- Uses `HStoreFormWidget` as the default widget
- Parses incoming JSON string values via `json.loads()`

## HStoreFormWidget

```python
from django_hstore_widget.widgets import HStoreFormWidget
```

Widget class that renders the custom `<django-hstore-widget>` web component.

- Inherits from `AdminTextareaWidget`
- Renders via `django_hstore_widget.html` template
- Loads JS as ESM module from static files

## Template Context

The widget template receives:

| Variable | Description |
|----------|-------------|
| `field_name` | The form field name |
| `field_data` | The current hstore data as dict |

## SVG Icons

The widget accepts SVG icon sources via HTML attributes:

| Attribute | Purpose |
|-----------|---------|
| `delete_svg_src` | Delete row icon |
| `add_svg_src` | Add row icon |
| `edit_svg_src` | Toggle textarea icon |
