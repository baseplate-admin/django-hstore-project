import os
import sys

from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "_extensions"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django.conf.global_settings")
import django
django.setup()

project = "Django HStore Project"
copyright = "2026, baseplate-admin"
author = "baseplate-admin"

html_theme = "shibuya"
html_theme_options = {
    "social": [
        {"name": "GitHub", "url": "https://github.com/baseplate-admin/django-hstore-widget", "icon": "mdi:github"},
    ],
}

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "myst_parser",
    "sphinxcontrib.mermaid",
    "sphinx_copybutton",
    "sphinx_tabs.tabs",
    "sphinx_contributors",
    "sphinx_iconify",
    "llms_txt_generator",
    "widget_builder",
]

templates_path = ["_templates"]
html_static_path = ["static"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

autodoc_typehints = "description"
autodoc_member_order = "groupwise"
autodoc_default_options = {
    "members": True,
    "undoc-members": True,
    "show-inheritance": True,
}

# MyST config for mermaid
myst_enable_extensions = [
    "colon_fence",
]
myst_fence_as_directive = ["mermaid"]
