# Django HStore Project

[![CI](https://github.com/baseplate-admin/django-hstore-widget/actions/workflows/ci.yml/badge.svg)](https://github.com/baseplate-admin/django-hstore-widget/actions/workflows/ci.yml)
[![Documentation Status](https://readthedocs.org/projects/django-hstore-project/badge/?version=latest)](https://django-hstore-project.readthedocs.io/en/latest/?badge=latest)
[![license: MIT](https://img.shields.io/badge/license-MIT-light.svg)](LICENSE)
[![uv](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json)](https://github.com/astral-sh/uv)

Monorepo for the Django HStore ecosystem packages.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [django-hstore-widget](packages/django_hstore_widget/) | Human-friendly HStore widget for Django admin | [![Pypi Badge](https://img.shields.io/pypi/v/django-hstore-widget.svg)](https://pypi.org/project/django-hstore-widget/) |
| [django-hstore-field](packages/django_hstore_field/) | Drop-in HStore field with auto-wired widget | [![Pypi Badge](https://img.shields.io/pypi/v/django-hstore-field.svg)](https://pypi.org/project/django-hstore-field/) |

## Quick Start

**For new projects**, use [django-hstore-field](packages/django_hstore_field/) — it auto-wires the widget.

**For lower-level control**, use [django-hstore-widget](packages/django_hstore_widget/) directly.

## Development

This project uses [uv](https://docs.astral.sh/uv/) for Python workspace management and npm for the frontend build.

```bash
# Install Python dependencies
uv sync --group test

# Install frontend dependencies
cd packages/django_hstore_widget && npm install

# Build frontend
npm run build

# Run tests
uv run pytest packages/django_hstore_widget/tests/
uv run pytest packages/django_hstore_field/tests/
```

## Docs

See the [Zensical docs](apps/docs/) for comprehensive documentation.

## License

MIT see [LICENSE](LICENSE)
