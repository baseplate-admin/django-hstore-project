import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django.conf.global_settings")
import django
django.setup()

project = "Django HStore Project"
copyright = "2026, baseplate-admin"
author = "baseplate-admin"

html_theme = "shibuya"
html_theme_options = {
    "fonts": {
        "text": "Source Sans 3",
        "code": "JetBrains Mono",
    },
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
]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

html_static_path = ["static"]

autodoc_typehints = "description"
autodoc_member_order = "groupwise"
autodoc_default_options = {
    "members": True,
    "undoc-members": True,
    "show-inheritance": True,
}
