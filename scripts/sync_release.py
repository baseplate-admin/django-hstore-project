#!/usr/bin/env python
"""Sync pyproject.toml versions from a release tag.

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


def get_version(pyproject: Path) -> str:
    text = pyproject.read_text()
    match = re.search(r'^version\s*=\s*"([^"]+)"', text, re.MULTILINE)
    if not match:
        raise ValueError(f"Version not found in {pyproject}")
    return match.group(1)


def set_version(pyproject: Path, version: str) -> None:
    text = pyproject.read_text()
    text = re.sub(
        r'^version\s*=\s*"[^"]+"',
        f'version = "{version}"',
        text,
        count=1,
        flags=re.MULTILINE,
    )
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

    # Parse tag like "widget-0.2.0" or "field-0.0.8"
    match = re.match(r"^(widget|field)-(.+)$", tag)
    if not match:
        print(f"Error: Tag '{tag}' does not match 'widget-<version>' or 'field-<version>'")
        sys.exit(1)

    pkg = match.group(1)
    version = match.group(2)
    pyproject = pyprojects[pkg]

    old_version = get_version(pyproject)
    set_version(pyproject, version)
    print(f"{pkg}: {old_version} -> {version}")


if __name__ == "__main__":
    main()
