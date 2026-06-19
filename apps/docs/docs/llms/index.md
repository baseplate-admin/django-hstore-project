# LLM Context

This monorepo contains two related Python packages for PostgreSQL hstore support in Django.

## Documentation

Full documentation is available at:

- [Home](../../index.rst)
- [Installation](../user-guide/installation.md)
- [Quick Start](../user-guide/quickstart.md)
- [HStore vs JSONB](../user-guide/hstore-vs-jsonb.md)
- [Best Practices](../user-guide/best-practices.md)
- [Architecture](../developer-guide/architecture.md)
- [Contributing](../developer-guide/contributing.md)
- [Frontend Build](../developer-guide/frontend-build.md)
- [Widget API](../../api/widget.rst)
- [Field API](../../api/field.rst)

## Packages

### django-hstore-widget (Lower Level)

A Django app providing a custom web component widget for editing hstore data in the Django admin. Built with LitElement, Vite, and TypeScript.

Key classes: `HStoreFormField`, `HStoreFormWidget`

### django-hstore-field (Higher Level)

A thin wrapper that auto-wires the widget. Provides a drop-in `HStoreField` class that overrides `formfield()` to inject the widget configuration.

Key class: `HStoreField`

## Technical Stack

- Python 3.10+, Django 5.0+, PostgreSQL 14+
- uv for workspace management, hatchling for builds
- Lit 3.3.3, Vite, TypeScript ESNext
- pytest + Playwright for testing
- Sphinx + Shibuya for docs
