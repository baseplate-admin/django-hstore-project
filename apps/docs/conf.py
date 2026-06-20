import os
import sys

from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "_extensions"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django.conf.global_settings")
import django
django.setup()

root_doc = "index"

project = "Django HStore Project"
copyright = "2026, baseplate-admin"
author = "baseplate-admin"

html_theme = "shibuya"
html_theme_options = {
    "github_url": "https://github.com/baseplate-admin/django-hstore-widget",
    "globaltoc_expand_depth": 1,
}

html_context = {
    "source_type": "github",
    "source_user": "baseplate-admin",
    "source_repo": "django-hstore-widget",
    "languages": [
        ("English", "/en/%s/", "en"),
        ("বাংলা", "/bn/%s/", "bn"),
        ("日本語", "/ja/%s/", "ja"),
        ("中文", "/zh/%s/", "zh"),
        ("മലയാളം", "/ml/%s/", "ml"),
        ("हिन्दी", "/hi/%s/", "hi"),
        ("Español", "/es/%s/", "es"),
        ("Français", "/fr/%s/", "fr"),
        ("العربية", "/ar/%s/", "ar"),
        ("Русский", "/ru/%s/", "ru"),
        ("Português", "/pt/%s/", "pt"),
    ],
}

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx.ext.intersphinx",
    "sphinx_tabs.tabs",
    "sphinx_termynal",
    "sphinxcontrib.mermaid",
    "sphinx_copybutton",
    "sphinx_design",
    "sphinx_contributors",
    "sphinx_iconify",
    "autoapi.extension",
    "llms_txt_generator",
    "widget_builder",
]

source_suffix = {
    ".rst": "restructuredtext",
}

locale_dirs = ["locales/"]
gettext_compact = False

templates_path = ["_templates"]
html_static_path = ["static"]
html_css_files = [
    "django-admin-fields.css",
]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", "locales"]

autodoc_typehints = "description"
autodoc_member_order = "groupwise"
autodoc_default_options = {
    "members": True,
    "undoc-members": True,
    "show-inheritance": True,
}

# AutoAPI config
autoapi_dirs = [
    "../../packages/django_hstore_widget/src/django_hstore_widget",
    "../../packages/django_hstore_field/src/django_hstore_field",
]
autoapi_options = [
    "members",
    "undoc-members",
    "show-inheritance",
]
autoapi_add_toctree_entry = True
autoapi_template_dir = "_templates/autoapi"

# LLMs.txt base URL — defaults to RTD canonical URL, falls back to relative.
llms_base_url = os.environ.get(
    "READTHEDOCS_CANONICAL_URL",
    "",
).rstrip("/")
llms_repo_url = os.environ.get(
    "LLMS_REPO_URL",
    "",
)

# Termynal config — FastAPI-inspired terminal styling
termynal_config = {
    "title": "bash",
    "macos": True,
}
