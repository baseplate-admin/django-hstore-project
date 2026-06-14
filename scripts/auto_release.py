#!/usr/bin/env python
"""Auto-tag and release both packages."""

import re
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
WIDGET_PYPROJECT = BASE_DIR / "packages" / "django_hstore_widget" / "pyproject.toml"
FIELD_PYPROJECT = BASE_DIR / "packages" / "django_hstore_field" / "pyproject.toml"


def get_version(pyproject_path: Path) -> str:
    text = pyproject_path.read_text()
    match = re.search(r'^version\s*=\s*"([^"]+)"', text, re.MULTILINE)
    if not match:
        raise ValueError(f"Could not find version in {pyproject_path}")
    return match.group(1)


def bump_version(version: str, part: str = "patch") -> str:
    parts = version.split(".")
    major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])

    if part == "major":
        major += 1
        minor = 0
        patch = 0
    elif part == "minor":
        minor += 1
        patch = 0
    else:
        patch += 1

    return f"{major}.{minor}.{patch}"


def set_version(pyproject_path: Path, new_version: str) -> None:
    text = pyproject_path.read_text()
    text = re.sub(
        r'^version\s*=\s*"[^"]+"',
        f'version = "{new_version}"',
        text,
        count=1,
        flags=re.MULTILINE,
    )
    pyproject_path.write_text(text)


def run(cmd: list[str]) -> None:
    print(f"  $ {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


def release(package: str, bump: str = "patch", dry_run: bool = False) -> None:
    if package == "widget":
        pyproject = WIDGET_PYPROJECT
        tag_prefix = "widget"
    elif package == "field":
        pyproject = FIELD_PYPROJECT
        tag_prefix = "field"
    else:
        print(f"Unknown package: {package}")
        sys.exit(1)

    old_version = get_version(pyproject)
    new_version = bump_version(old_version, bump)
    tag_name = f"{tag_prefix}-{new_version}"

    print(f"{package}: {old_version} -> {new_version} (tag: {tag_name})")

    if dry_run:
        print("  (dry run - no changes made)")
        return

    set_version(pyproject, new_version)
    run(["git", "add", str(pyproject)])
    run(["git", "commit", "-m", f"Release {package}-{new_version}"])
    run(["git", "tag", tag_name])
    run(["git", "push", "origin", "master", tag_name])

    print(f"Released {package}-{new_version}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Auto-release a package")
    parser.add_argument(
        "package", choices=["widget", "field", "all"], help="Package to release"
    )
    parser.add_argument(
        "--bump",
        choices=["patch", "minor", "major"],
        default="patch",
        help="Version part to bump",
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without changes")

    args = parser.parse_args()

    if args.package == "all":
        release("widget", args.bump, args.dry_run)
        release("field", args.bump, args.dry_run)
    else:
        release(args.package, args.bump, args.dry_run)
