"""Sphinx extension that generates llms.txt from the documentation at build time."""

import re

from pathlib import Path

from sphinx.application import Sphinx


def generate_llms_txt(app: Sphinx, exception=None):
    """Generate llms.txt after the build completes."""
    if exception:
        return

    out_dir = Path(app.outdir)
    docs_dir = Path(app.srcdir) / "docs"

    llms_content = build_llms_content(docs_dir)
    (out_dir / "llms.txt").write_text(llms_content, encoding="utf-8")


def _strip_leading_heading(text: str) -> str:
    """Remove the top-level heading from a markdown file so it can be inlined."""
    return re.sub(r"^# .+\n", "", text, count=1)


def build_llms_content(docs_dir: Path) -> str:
    """Assemble the llms.txt content from the documentation source files."""
    sections = [
        PROJECT_HEADER,
        _section_packages(),
        _section_installation(docs_dir),
        _section_quickstart(docs_dir),
        _section_api(),
        _section_frontend(docs_dir),
        _section_best_practices(docs_dir),
        _section_hstore_vs_jsonb(docs_dir),
        _section_contributing(docs_dir),
    ]
    return "\n\n".join(sections) + "\n"


PROJECT_HEADER = """\
# Django HStore Project

A monorepo for the Django HStore ecosystem providing a human-friendly,
Lit-based key-value editor for PostgreSQL hstore fields in Django admin.

- **Repository**: https://github.com/baseplate-admin/django-hstore-widget
- **Documentation**: https://django-hstore-widget.readthedocs.io
- **Python**: 3.10+
- **Django**: 5.0+
- **PostgreSQL**: 14+"""


def _section_packages() -> str:
    return """\
# Packages

## django-hstore-widget

Lower-level package providing the custom hstore editor widget for Django admin.

- **HStoreFormWidget** — Lit-based key-value editor replacing the default textarea
- **HStoreFormField** — Form field wired to the custom widget with JSON parsing
- **check_database_backend_is_postgres** — System check that warns when the default
  database is not PostgreSQL

## django-hstore-field

Higher-level package providing a drop-in HStoreField replacement.

- **HStoreField** — Overrides ``formfield()`` so the admin and ModelForms
  automatically use ``HStoreFormField`` and ``HStoreFormWidget`` with no
  manual form configuration required."""


def _section_installation(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "installation.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Installation\n\n" + _strip_leading_heading(raw).strip()


def _section_quickstart(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "quickstart.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Quick Start\n\n" + _strip_leading_heading(raw).strip()



def _section_api() -> str:
    return """\
# API Reference

## django_hstore_widget.widgets.HStoreFormWidget

Django admin widget that renders the custom hstore editor.

Replaces the default textarea with a Lit-based key-value editor component.
Loads the widget JavaScript as an ES module via the ``Media`` inner class.

```python
from django_hstore_widget.widgets import HStoreFormWidget

widget = HStoreFormWidget()
```

### render(name, value, attrs=None, renderer=None)

Render the widget HTML for a given form field.

- ``name`` — HTML name attribute for the field
- ``value`` — Current hstore data as a key-value mapping
- ``attrs`` — Additional HTML attributes passed to the template

### Media.js

``['admin/js/django_hstore_widget/django-hstore-widget.js']``

## django_hstore_widget.forms.HStoreFormField

Form field that uses ``HStoreFormWidget``.

Extends Django's built-in ``HStoreField`` to inject the custom widget and
override ``clean()`` so incoming values are parsed through ``json.loads``.

```python
from django_hstore_widget.forms import HStoreFormField

field = HStoreFormField()
```

### clean(value)

Parse the raw form value into a Python dict using ``json.loads``.

## django_hstore_widget.checks.check_database_backend_is_postgres

System check that warns when the default DB backend is not PostgreSQL.
Runs during ``manage.py check`` and ``manage.py migrate``.

## django_hstore_field.HStoreField

Drop-in replacement for Django's ``HStoreField`` with the custom widget.

Overrides ``formfield()`` so that the admin and ModelForms automatically
use ``HStoreFormField`` and ``HStoreFormWidget``.

```python
from django.db import models
from django_hstore_field import HStoreField

class Product(models.Model):
    name = models.CharField(max_length=100)
    metadata = HStoreField()
    class Meta:
        app_label = "example"
```

### formfield(**kwargs)

Return a form field class pre-configured with the custom widget.
Pass ``form_class`` or ``widget`` to override the defaults."""


def _section_frontend(docs_dir: Path) -> str:
    path = docs_dir / "developer-guide" / "frontend-build.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    arch_path = docs_dir / "developer-guide" / "architecture.md"
    arch_raw = arch_path.read_text(encoding="utf-8") if arch_path.exists() else ""
    return (
        "# Frontend Architecture\n\n"
        + _strip_leading_heading(arch_raw).strip()
        + "\n\n"
        + _strip_leading_heading(raw).strip()
    )


def _section_best_practices(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "best-practices.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Best Practices\n\n" + _strip_leading_heading(raw).strip()


def _section_hstore_vs_jsonb(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "hstore-vs-jsonb.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# HStore vs JSONB\n\n" + _strip_leading_heading(raw).strip()


def _section_contributing(docs_dir: Path) -> str:
    path = docs_dir / "developer-guide" / "contributing.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Contributing\n\n" + _strip_leading_heading(raw).strip()


def setup(app: Sphinx):
    app.connect("build-finished", generate_llms_txt)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
