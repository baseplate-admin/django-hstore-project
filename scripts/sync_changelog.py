#!/usr/bin/env python
"""Sync GitHub releases to CHANGELOG.md.

Fetches releases from the current repo and updates CHANGELOG.md with the latest tags.
"""

import json
import subprocess
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
CHANGELOG = BASE_DIR / "CHANGELOG.md"

PACKAGES = {
    "django-hstore-widget": "widget-",
    "django-hstore-field": "field-",
}


def fetch_tags(prefix: str, max_tags: int = 30) -> list[dict]:
    """Fetch tags and commits from git for a given prefix."""
    result = subprocess.run(
        ["git", "tag", "-l", f"{prefix}*"],
        capture_output=True,
        text=True,
        cwd=BASE_DIR,
    )
    if result.returncode != 0:
        print(f"Failed to fetch tags: {result.stderr}")
        return []

    tags = sorted(result.stdout.strip().splitlines(), reverse=True)[:max_tags]
    releases = []

    for tag in tags:
        # Get the commit message and date for this tag
        commit_result = subprocess.run(
            ["git", "log", "-1", "--format=%H|%s|%ci", tag],
            capture_output=True,
            text=True,
            cwd=BASE_DIR,
        )
        if commit_result.returncode != 0:
            continue

        parts = commit_result.stdout.strip().split("|", 2)
        commit_hash = parts[0] if len(parts) > 0 else ""
        message = parts[1] if len(parts) > 1 else ""
        date = parts[2][:10] if len(parts) > 2 else ""

        releases.append({
            "tag": tag,
            "version": tag[len(prefix):],
            "message": message,
            "date": date,
            "commit": commit_hash[:7],
        })

    return releases


def generate_changelog() -> str:
    """Generate the full changelog content."""
    sections = [
        "# Changelog\n",
        "All notable changes to the Django HStore Project packages.\n",
        f"\n_Last updated: {datetime.now().strftime('%Y-%m-%d')}_\n",
    ]

    for package, prefix in PACKAGES.items():
        sections.append(f"\n## {package}\n")
        releases = fetch_tags(prefix)

        if not releases:
            sections.append("_No releases found._\n")
            continue

        for release in releases:
            sections.append(
                f"### v{release['version']} - {release['date']}\n"
            )
            if release["message"]:
                sections.append(f"- {release['message']}")
            sections.append("")

    return "\n".join(sections)


def main() -> None:
    print("Fetching tags from git...")
    content = generate_changelog()
    CHANGELOG.write_text(content)
    print(f"CHANGELOG.md updated: {CHANGELOG}")


if __name__ == "__main__":
    main()
