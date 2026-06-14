# LLM Context: django-hstore-widget

## Overview

A Django app providing a custom web component widget for editing PostgreSQL hstore data in the Django admin. The widget renders key-value pairs as editable rows with add/delete functionality and a raw JSON textarea toggle.

## Python Package

- `HStoreFormWidget` — Extends `AdminTextareaWidget`. Renders `<django-hstore-widget>` custom element template. Loads JS as ESM module.
- `HStoreFormField` — Extends Django's `HStoreField`. Uses `HStoreFormWidget`, parses JSON via `json.loads()`.
- `checks.py` — Django system check that validates postgres/postgis backend.
- `apps.py` — AppConfig that imports checks module in `ready()`.
- Migration applies `HStoreExtension()` for postgres hstore support.

## Frontend

- LitElement v3.3.3 custom element `django-hstore-widget`
- Properties: `json`, `fieldName`, `cols`, `rows`, SVG sources
- State: `isMounted`, `parsingError`, `rawTextAreaContent`, `keyValueRows`, `displayMode`
- Sub-component: `image-icon` (light DOM, no shadow root)
- Global pub-sub store for SVG icon sources
- Webpack 5 + TypeScript ESNext + Lit decorators

## Build

- webpack entry: `src/frontend/index.ts`
- Output: `dist/components/django-hstore-widget.js`
- `scripts/copy.ts` copies to `src/django_hstore_widget/static/admin/js/django_hstore_widget/`
- Babel + esbuild-register for TS config loading
- Jest for unit tests, Playwright for e2e
