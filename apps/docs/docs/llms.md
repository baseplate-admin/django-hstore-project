# LLM Context: Django HStore Project

This monorepo contains two related Python packages for PostgreSQL hstore support in Django.

## django-hstore-widget (Lower Level)

A Django app providing a custom web component widget for editing hstore data in the Django admin. Built with LitElement, webpack, and TypeScript. The widget renders as a key-value editor with add/delete row functionality and a raw JSON textarea toggle.

Key classes: `HStoreFormField`, `HStoreFormWidget`

## django-hstore-field (Higher Level)

A thin wrapper that auto-wires the widget. Provides a drop-in `HStoreField` class that overrides `formfield()` to inject the widget configuration. No manual form setup needed.

Key class: `HStoreField`

## Technical Stack

- Python 3.10+, Django 5.0+, PostgreSQL 14+
- uv for workspace management, hatchling for builds
- Lit 3.3.3, webpack 5, TypeScript ESNext
- pytest + Playwright for testing
- Zensical (Material for MkDocs) for docs
