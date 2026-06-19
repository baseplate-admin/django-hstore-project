"""Sphinx extension that auto-generates llms.txt files from the docs at build time.

Produces:
    - llms.txt                index file listing all context files
    - llms-widget.txt         django-hstore-widget package context
    - llms-field.txt          django-hstore-field package context
    - llms-full.txt           complete project documentation for LLM context
"""

import re

from pathlib import Path

from sphinx.application import Sphinx


BASE_URL = ""  # Set from app.config in setup()


def generate_llms_txt(app: Sphinx, exception=None):
    """Generate llms.txt files after the build completes."""
    if exception:
        return

    out_dir = Path(app.outdir)
    docs_dir = Path(app.srcdir) / "docs"

    widget_content = _build_widget_section(docs_dir)
    field_content = _build_field_section(docs_dir)
    full_content = _build_full_content(docs_dir, widget_content, field_content)

    (out_dir / "llms-widget.txt").write_text(widget_content, encoding="utf-8")
    (out_dir / "llms-field.txt").write_text(field_content, encoding="utf-8")
    (out_dir / "llms-full.txt").write_text(full_content, encoding="utf-8")

    index = "# llms.txt\n\n"
    index += "This file is an index for LLM context files.\n\n"
    index += f"- {BASE_URL}llms-widget.txt\n"
    index += f"- {BASE_URL}llms-field.txt\n"
    index += f"- {BASE_URL}llms-full.txt\n"
    (out_dir / "llms.txt").write_text(index, encoding="utf-8")


def _strip_leading_heading(text: str) -> str:
    """Remove the top-level heading from a source file so it can be inlined."""
    text = re.sub(r"^# .+\n", "", text, count=1)
    text = re.sub(r"^[=\-~`]+$\n", "", text, count=1)
    return text


# ---------------------------------------------------------------------------
# Shared header
# ---------------------------------------------------------------------------

SHARED_HEADER = ""  # Built in setup() from config


# ---------------------------------------------------------------------------
# Widget package
# ---------------------------------------------------------------------------

def _build_widget_section(docs_dir: Path) -> str:
    sections = [
        SHARED_HEADER,
        _widget_api(),
        _section_frontend(docs_dir),
    ]
    return "\n\n".join(sections) + "\n"


def _widget_api() -> str:
    return """\
# django-hstore-widget API

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
Runs during ``manage.py check`` and ``manage.py migrate``."""


# ---------------------------------------------------------------------------
# Field package
# ---------------------------------------------------------------------------

def _build_field_section(docs_dir: Path) -> str:
    sections = [
        SHARED_HEADER,
        _field_api(),
        _section_installation(docs_dir),
        _section_quickstart(docs_dir),
    ]
    return "\n\n".join(sections) + "\n"


def _field_api() -> str:
    return """\
# django-hstore-field API

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


# ---------------------------------------------------------------------------
# Full project
# ---------------------------------------------------------------------------

def _build_full_content(docs_dir: Path, widget: str, field: str) -> str:
    sections = [
        SHARED_HEADER,
        _section_packages(),
        _section_installation(docs_dir),
        _section_quickstart(docs_dir),
        _widget_api(),
        _field_api(),
        _section_frontend(docs_dir),
        _section_best_practices(docs_dir),
        _section_hstore_vs_jsonb(docs_dir),
        _section_contributing(docs_dir),
    ]
    return "\n\n".join(sections) + "\n"


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


# ---------------------------------------------------------------------------
# Shared doc sections (read from source files)
# ---------------------------------------------------------------------------

def _section_installation(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "installation.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Installation\n\n" + _strip_leading_heading(raw).strip()


def _section_quickstart(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "quickstart.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Quick Start\n\n" + _strip_leading_heading(raw).strip()


def _section_frontend(docs_dir: Path) -> str:
    path = docs_dir / "developer-guide" / "frontend-build.md"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    arch_path = docs_dir / "developer-guide" / "architecture.rst"
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


# ---------------------------------------------------------------------------
# Sphinx entry point
# ---------------------------------------------------------------------------

def _build_shared_header(repo_url: str, docs_url: str) -> str:
    """Build the shared header with configurable URLs."""
    lines = [
        "# Django HStore Project",
        "",
        "A monorepo for the Django HStore ecosystem providing a human-friendly,",
        "Lit-based key-value editor for PostgreSQL hstore fields in Django admin.",
        "",
    ]
    if repo_url:
        lines.append(f"- **Repository**: {repo_url}")
    if docs_url:
        lines.append(f"- **Documentation**: {docs_url}")
    lines.extend([
        "- **Python**: 3.10+",
        "- **Django**: 5.0+",
        "- **PostgreSQL**: 14+",
    ])
    return "\n".join(lines)


def setup(app: Sphinx):
    global BASE_URL, SHARED_HEADER
    base = getattr(app.config, "llms_base_url", "")
    BASE_URL = base + "/" if base else ""
    repo_url = getattr(app.config, "llms_repo_url", "")
    SHARED_HEADER = _build_shared_header(repo_url, base)
    app.connect("build-finished", generate_llms_txt)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
