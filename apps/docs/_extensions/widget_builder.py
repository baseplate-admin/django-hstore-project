"""Sphinx extension that ensures the widget JS bundle is available at build time.

On RTD the ``pre_build`` job already builds and copies the widget bundle
into ``static/``.  This extension copies the bundle from the widget
package's static directory as a fallback for local builds.
"""

import shutil
import logging

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


def ensure_widget_bundle(app: Sphinx, env, exception=None):
    """Copy the widget JS bundle into the docs static directory if present."""
    if exception:
        return

    docs_static = Path(app.srcdir) / "static"
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


def setup(app: Sphinx):
    app.connect("env-before-read-docs", ensure_widget_bundle, priority=0)
    return {
        "version": "0.1",
        "parallel_read_safe": False,
        "parallel_write_safe": True,
    }
