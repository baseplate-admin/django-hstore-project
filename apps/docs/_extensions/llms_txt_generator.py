"""Sphinx extension that auto-generates llms.txt files from the docs at build time.

Produces:
    - llms.txt                index file listing all context files
    - llms-widget.txt         django-hstore-widget package context
    - llms-field.txt          django-hstore-field package context
    - llms-full.txt           complete project documentation for LLM context
    - llms-<lang>.txt         per-language index files for each locale
"""

import re
from pathlib import Path

from sphinx.application import Sphinx

BASE_URL = ""  # Set from app.config in setup()
LOCALES_DIR = ""  # Set from app.srcdir in setup()


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

    # Discover locales from the locales directory
    locales = _discover_locales()

    # Build per-language index files
    lang_entries = []
    for lang_code, lang_name in locales:
        lang_url = f"{BASE_URL}{lang_code}/" if BASE_URL else f"/{lang_code}/"
        lang_file = f"llms-{lang_code}.txt"
        lang_content = _build_lang_index(lang_code, lang_name, lang_url)
        (out_dir / lang_file).write_text(lang_content, encoding="utf-8")
        lang_entries.append(f"- {BASE_URL}{lang_file}\n")

    # Build main index with per-language entries
    index = "# llms.txt\n\n"
    index += "This file is an index for LLM context files.\n\n"
    index += "## Package Context\n\n"
    index += f"- {BASE_URL}llms-widget.txt\n"
    index += f"- {BASE_URL}llms-field.txt\n"
    index += f"- {BASE_URL}llms-full.txt\n\n"
    index += "## Translations\n\n"
    index += "".join(lang_entries)
    (out_dir / "llms.txt").write_text(index, encoding="utf-8")


def _discover_locales() -> list[tuple[str, str]]:
    """Discover configured locales from the locales directory."""
    locales_path = Path(LOCALES_DIR)
    if not locales_path.exists():
        return []

    locale_names = {
        "ar": "العربية",
        "bn": "বাংলা",
        "de": "Deutsch",
        "es": "Español",
        "fa": "فارسی",
        "fr": "Français",
        "hi": "हिन्दी",
        "id": "Bahasa Indonesia",
        "it": "Italiano",
        "ja": "日本語",
        "ko": "한국어",
        "ml": "മലയാളം",
        "pl": "Polski",
        "pt": "Português",
        "ru": "Русский",
        "th": "ไทย",
        "tr": "Türkçe",
        "uk": "Українська",
        "vi": "Tiếng Việt",
        "zh": "中文",
    }

    result = []
    for loc_dir in sorted(locales_path.iterdir()):
        if not loc_dir.is_dir():
            continue
        lang_code = loc_dir.name
        po_file = loc_dir / "LC_MESSAGES" / "index.po"
        if po_file.exists():
            lang_name = locale_names.get(lang_code, lang_code.upper())
            result.append((lang_code, lang_name))
    return result


def _build_lang_index(lang_code: str, lang_name: str, lang_url: str) -> str:
    """Build a per-language llms.txt index file."""
    return f"""\
# Django HStore Project — {lang_name} ({lang_code})

Translated documentation index for the Django HStore Project.

- **Language**: {lang_name} ({lang_code})
- **Documentation**: {lang_url}

## Pages

- {lang_url}index.html
- {lang_url}docs/user-guide/installation.html
- {lang_url}docs/user-guide/quickstart.html
- {lang_url}docs/user-guide/best-practices.html
- {lang_url}docs/developer-guide/architecture.html
- {lang_url}docs/developer-guide/frontend-build.html
- {lang_url}docs/developer-guide/contributing.html
- {lang_url}docs/technical/hstore-vs-jsonb.html
- {lang_url}docs/technical/use-cases.html
- {lang_url}docs/technical/index.html
- {lang_url}docs/playground.html
- {lang_url}docs/license.html
- {lang_url}api/index.html
"""


def _strip_leading_heading(text: str) -> str:
    """Remove the top-level heading from a source file so it can be inlined."""
    # Strip RST title: line followed by underline (=== or ---)
    text = re.sub(r"^.+\n[=\-]+$\n?", "", text, count=1)
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
    path = docs_dir / "user-guide" / "installation.rst"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Installation\n\n" + _strip_leading_heading(raw).strip()


def _section_quickstart(docs_dir: Path) -> str:
    path = docs_dir / "user-guide" / "quickstart.rst"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Quick Start\n\n" + _strip_leading_heading(raw).strip()


def _section_frontend(docs_dir: Path) -> str:
    path = docs_dir / "developer-guide" / "frontend-build.rst"
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
    path = docs_dir / "user-guide" / "best-practices.rst"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# Best Practices\n\n" + _strip_leading_heading(raw).strip()


def _section_hstore_vs_jsonb(docs_dir: Path) -> str:
    path = docs_dir / "technical" / "hstore-vs-jsonb.rst"
    raw = path.read_text(encoding="utf-8") if path.exists() else ""
    return "# HStore vs JSONB\n\n" + _strip_leading_heading(raw).strip()


def _section_contributing(docs_dir: Path) -> str:
    path = docs_dir / "developer-guide" / "contributing.rst"
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
    global BASE_URL, SHARED_HEADER, LOCALES_DIR
    base = getattr(app.config, "llms_base_url", "")
    BASE_URL = base + "/" if base else ""
    repo_url = getattr(app.config, "llms_repo_url", "")
    SHARED_HEADER = _build_shared_header(repo_url, base)
    LOCALES_DIR = str(Path(app.srcdir) / "locales")
    app.connect("build-finished", generate_llms_txt)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
