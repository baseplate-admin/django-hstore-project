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
            frontend/          # TypeScript + webpack
                components/    # LitElement web components
                stores/        # Pub-sub state store
                lib/           # Utilities (classnames)
                mappings/      # Constants
        tests/                 # Python tests + Playwright e2e
        webpack.config.ts      # Frontend build config
        package.json           # NPM dependencies
    django_hstore_field/      # Field package (higher level)
        src/
            django_hstore_field/
                fields.py      # HStoreField subclass
        tests/                 # Python tests
apps/
    docs/                     # Zensical documentation
```

## Dependency Flow

```
django_hstore_field
    -> django_hstore_widget
        -> Django (runtime)
        -> Lit (frontend)
```

## Frontend Architecture

The widget uses [LitElement](https://lit.dev/) for web components:

- `django-hstore-widget` — Main widget component
- `image-icon` — Icon sub-component (light DOM, no shadow root)
- Global pub-sub store for SVG icon sources
- Webpack bundler with TypeScript support
