# LLM Full Context: Django HStore Project

## Repository Structure

```
django-hstore-project/
pyproject.toml              # uv workspace root
packages/
    django_hstore_widget/   # Widget package
        pyproject.toml      # hatchling build, Django 5.0+
        src/
            django_hstore_widget/
                __init__.py
                apps.py         # AppConfig, imports checks module
                checks.py       # System check: validates postgres backend
                forms.py        # HStoreFormField (extends django HStoreField)
                widgets.py      # HStoreFormWidget (extends AdminTextareaWidget)
                migrations/     # HStoreExtension migration
                templates/      # django_hstore_widget.html
            frontend/           # TypeScript + webpack
                index.ts        # Entry point
                components/
                    django-hstore-widget/  # Main LitElement widget
                    image-icon/           # Icon sub-component
                stores/image.ts   # Pub-sub store for SVG sources
                lib/classnames.ts # clsx-like utility
                mappings/         # Django CSS classes, GitHub URL, SVG keys
        tests/
            conftest.py         # pytest config, Django settings
            test_hstore_field.py # Widget tests
            cat/                # Test Django app
        webpack.config.ts       # Webpack build config
        package.json            # NPM dependencies (lit, webpack, jest, playwright)
    django_hstore_field/       # Field package
        pyproject.toml
        src/django_hstore_field/
            __init__.py         # Re-exports HStoreField
            fields.py           # HStoreField subclass (auto-wires widget)
        tests/
            conftest.py
            test_field.py
            cat/                # Test Django app
apps/
    docs/                      # Zensical documentation
scripts/
    auto_release.py            # Auto-tag + release
    sync_changelog.py          # Sync GH releases to CHANGELOG.md
```

## Widget Frontend Details

The widget is a LitElement custom element `django-hstore-widget`. It:
- Parses JSON from the `json` attribute into key-value rows
- Renders editable rows with key/value inputs and delete buttons
- Supports adding new rows and toggling to raw JSON textarea mode
- Uses a global pub-sub store for SVG icon sources
- Injects CSS as a `<style>` element in light DOM
- Registers the `image-icon` sub-component once globally

## Build Pipeline

1. webpack bundles TypeScript to `dist/components/django-hstore-widget.js`
2. `scripts/copy.ts` copies to Django static directory
3. Django admin loads the JS as an ESM module

## Testing

- Jest: Frontend unit tests (classnames utility)
- Playwright: Frontend e2e tests (widget rendering, button interactions)
- pytest: Backend tests (Django admin integration, model creation)
- Matrix: Python 3.10-3.14, PyPy 3.10/3.11, PostgreSQL 14-18
