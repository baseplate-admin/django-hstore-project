"""Sphinx extension that ensures the widget JS bundle and admin SVG icons are available at build time.

On RTD the ``pre_build`` job already builds and copies the widget bundle
into ``static/``.  This extension copies the bundle from the widget
package's static directory as a fallback for local builds. It also copies
Django admin SVG icons (delete, add, edit) so the playground page can
render them.
"""

import logging
import shutil
from pathlib import Path

from sphinx.application import Sphinx

logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
WIDGET_SRC = (
    REPO_ROOT
    / "packages"
    / "django_hstore_widget"
    / "src"
    / "django_hstore_widget"
    / "static"
    / "admin"
    / "js"
    / "django_hstore_widget"
)

# SVG icons needed by the widget for add/delete/edit actions
ADMIN_SVG_ICONS = [
    "icon-deletelink.svg",
    "icon-addlink.svg",
    "icon-changelink.svg",
]


def _copy_widget_bundle(docs_static: Path) -> None:
    """Copy the widget JS bundle into the docs static directory if present."""
    target_dir = docs_static / "admin" / "js" / "django_hstore_widget"
    target_dir.mkdir(parents=True, exist_ok=True)

    # If already copied by pre_build or a previous run, skip
    existing = list(target_dir.iterdir())
    if existing and any(f.suffix == ".css" for f in existing):
        logger.info("Widget bundle already present in static dir.")
        return

    # Copy from widget package static directory
    if WIDGET_SRC.exists():
        for item in WIDGET_SRC.iterdir():
            if item.is_file():
                shutil.copy2(item, target_dir / item.name)
        logger.info(f"Copied widget bundle from {WIDGET_SRC}")
    else:
        logger.warning(
            "Widget bundle not found — the playground page will not work. "
            "Run the widget build step before building docs."
        )


def _copy_admin_svg_icons(docs_static: Path) -> None:
    """Copy Django admin SVG icons into the docs static directory."""
    # Try multiple sources: installed Django package, then widget package static
    svg_sources: list[Path] = []

    # Source 1: Django admin static files from the virtual environment
    django_admin_static = (
        Path(__file__).resolve().parent.parent.parent.parent
        / ".venv"
        / "Lib"
        / "site-packages"
        / "django"
        / "contrib"
        / "admin"
        / "static"
        / "admin"
        / "img"
    )
    if django_admin_static.exists():
        svg_sources.append(django_admin_static)

    # Source 2: widget package static files
    widget_static = (
        REPO_ROOT
        / "packages"
        / "django_hstore_widget"
        / "src"
        / "django_hstore_widget"
        / "static"
        / "admin"
        / "img"
    )
    if widget_static.exists():
        svg_sources.append(widget_static)

    target_dir = docs_static / "admin" / "img"
    target_dir.mkdir(parents=True, exist_ok=True)

    copied = 0
    for icon_name in ADMIN_SVG_ICONS:
        target_file = target_dir / icon_name
        if target_file.exists():
            continue
        for source_dir in svg_sources:
            source_file = source_dir / icon_name
            if source_file.exists():
                shutil.copy2(source_file, target_file)
                copied += 1
                break

    if copied:
        logger.info(f"Copied {copied} admin SVG icon(s) to {target_dir}")
    else:
        logger.warning("No admin SVG icons found — playground icons may not render")


def ensure_widget_bundle(app: Sphinx, env, exception=None):
    """Copy the widget JS bundle and admin SVG icons into the docs static directory."""
    if exception:
        return

    docs_static = Path(app.srcdir) / "static"
    _copy_widget_bundle(docs_static)
    _copy_admin_svg_icons(docs_static)


def setup(app: Sphinx):
    app.connect("env-before-read-docs", ensure_widget_bundle, priority=0)
    return {
        "version": "0.1",
        "parallel_read_safe": False,
        "parallel_write_safe": True,
    }
