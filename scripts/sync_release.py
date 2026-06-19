#!/usr/bin/env python
"""Sync pyproject.toml and __init__.py versions from a release tag.

Also pins inter-package dependencies to the exact released version.

Usage:
    python scripts/sync_release.py widget-0.2.0
    python scripts/sync_release.py field-0.0.8
"""

import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent


def get_pyprojects() -> dict[str, Path]:
    return {
        "widget": BASE_DIR / "packages" / "django_hstore_widget" / "pyproject.toml",
        "field": BASE_DIR / "packages" / "django_hstore_field" / "pyproject.toml",
    }


def get_init_files() -> dict[str, Path]:
    return {
        "widget": (
            BASE_DIR
            / "packages"
            / "django_hstore_widget"
            / "src"
            / "django_hstore_widget"
            / "__init__.py"
        ),
        "field": (
            BASE_DIR
            / "packages"
            / "django_hstore_field"
            / "src"
            / "django_hstore_field"
            / "__init__.py"
        ),
    }


def get_version(pyproject: Path) -> str:
    text = pyproject.read_text()
    match = re.search(r'^version\s*=\s*"([^"]+)"', text, re.MULTILINE)
    if not match:
        raise ValueError(f"Version not found in {pyproject}")
    return match.group(1)


def set_pyproject_version(pyproject: Path, version: str) -> None:
    text = pyproject.read_text()
    text = re.sub(
        r'^version\s*=\s*"[^"]+"',
        f'version = "{version}"',
        text,
        count=1,
        flags=re.MULTILINE,
    )
    pyproject.write_text(text)


def set_init_version(init_file: Path, version: str) -> None:
    text = init_file.read_text()
    text = re.sub(
        r'__version__\s*=\s*"[^"]+"',
        f'__version__ = "{version}"',
        text,
        count=1,
        flags=re.MULTILINE,
    )
    init_file.write_text(text)


def pin_dependency(pyproject: Path, package: str, version: str) -> None:
    """Pin a dependency to an exact version in the dependencies list."""
    text = pyproject.read_text()
    # Match patterns like "django-hstore-widget>=0.1.0" or "django-hstore-widget==0.1.0"
    pattern = rf'({re.escape(package)})[><=!~]+[^",\]]*'
    replacement = f'\1=={version}'
    text = re.sub(pattern, replacement, text)
    pyproject.write_text(text)


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python scripts/sync_release.py <tag>")
        print("Examples:")
        print("  python scripts/sync_release.py widget-0.2.0")
        print("  python scripts/sync_release.py field-0.0.8")
        sys.exit(1)

    tag = sys.argv[1].lstrip("v")
    pyprojects = get_pyprojects()
    init_files = get_init_files()

    # Parse tag like "widget-0.2.0" or "field-0.0.8"
    match = re.match(r"^(widget|field)-(.+)$", tag)
    if not match:
        print(f"Error: Tag '{tag}' does not match 'widget-<version>' or 'field-<version>'")
        sys.exit(1)

    pkg = match.group(1)
    version = match.group(2)
    pyproject = pyprojects[pkg]
    init_file = init_files[pkg]

    old_version = get_version(pyproject)
    set_pyproject_version(pyproject, version)
    print(f"{pkg} pyproject.toml: {old_version} -> {version}")

    if init_file.exists():
        set_init_version(init_file, version)
        print(f"{pkg} __init__.py: synced __version__ to {version}")

    # Pin inter-package dependencies
    if pkg == "widget":
        # Update field's dependency on widget to pin exact version
        field_pyproject = pyprojects["field"]
        pin_dependency(field_pyproject, "django-hstore-widget", version)
        print(f"field pyproject.toml: pinned django-hstore-widget=={version}")


if __name__ == "__main__":
    main()
