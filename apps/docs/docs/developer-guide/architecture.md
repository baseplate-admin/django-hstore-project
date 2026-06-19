# Architecture

## Package Structure

```
django-hstore-project/
packages/
    django_hstore_widget/     # Widget package (lower level)
        src/
            django_hstore_widget/  # Python package
                widgets.py     # HStoreFormWidget
                forms.py       # HStoreFormField
                checks.py      # PostgreSQL validation
                templates/     # Widget template
            frontend/          # TypeScript + Vite
                components/    # LitElement web components
                stores/        # Pub-sub state store
                lib/           # Utilities (classnames)
                mappings/      # Constants
        tests/                 # Python tests + Playwright e2e
        vite.config.ts         # Frontend build config
        package.json           # NPM dependencies
    django_hstore_field/      # Field package (higher level)
        src/
            django_hstore_field/
                fields.py      # HStoreField subclass
        tests/                 # Python tests
apps/
    docs/                     # Sphinx documentation
```

## Dependency Flow

.. mermaid::

    graph TD
        A[django_hstore_field] --> B[django_hstore_widget]
        B --> C[Django runtime]
        B --> D[Lit frontend]

## Frontend Architecture

The widget uses [LitElement](https://lit.dev/) for web components:

- `django-hstore-widget` - Main widget component
- `image-icon` - Icon sub-component (light DOM, no shadow root)
- Global pub-sub store for SVG icon sources
- Vite bundler with TypeScript support

## Data Flow

.. mermaid::

    sequenceDiagram
        participant Admin as Django Admin
        participant Widget as HStoreFormWidget
        participant FE as Frontend Component
        participant Store as Pub-Sub Store
        participant BE as Django Backend

        Admin->>Widget: render field
        Widget->>FE: mount web component
        FE->>FE: user edits key-value pairs
        FE->>Store: emit changes
        FE->>BE: submit form as JSON
