#!/usr/bin/env python
"""Sync GitHub releases to CHANGELOG.md."""

import json
import subprocess
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
CHANGELOG = BASE_DIR / "CHANGELOG.md"

REPOS = {
    "django-hstore-widget": "baseplate-admin/django-hstore-widget",
    "django-hstore-field": "baseplate-admin/django-hstore-field",
}


def fetch_releases(repo: str, max_releases: int = 30) -> list[dict]:
    """Fetch releases from GitHub via gh CLI."""
    result = subprocess.run(
        ["gh", "api", f"repos/{repo}/releases"],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Failed to fetch releases for {repo}: {result.stderr}")
        return []

    releases = json.loads(result.stdout)
    return releases[:max_releases]


def format_release(release: dict) -> str:
    """Format a single release entry."""
    tag = release["tag_name"]
    name = release.get("name", tag)
    published = release["published_at"][:10]
    body = release.get("body", "")

    lines = [f"### {name} ({tag}) - {published}", ""]
    if body:
        lines.append(body)
        lines.append("")

    return "\n".join(lines)


def generate_changelog() -> str:
    """Generate the full changelog content."""
    sections = [
        "# Changelog\n",
        "All notable changes to the Django HStore Project packages.\n",
        f"\n_Last updated: {datetime.now().strftime('%Y-%m-%d')}_\n",
    ]

    for package, repo in REPOS.items():
        sections.append(f"\n## {package}\n")
        releases = fetch_releases(repo)

        if not releases:
            sections.append("_No releases found._\n")
            continue

        for release in releases:
            sections.append(format_release(release))

    return "\n".join(sections)


def main() -> None:
    print("Fetching releases from GitHub...")
    content = generate_changelog()
    CHANGELOG.write_text(content)
    print(f"CHANGELOG.md updated: {CHANGELOG}")


if __name__ == "__main__":
    main()
