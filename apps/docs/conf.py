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

_rtd_version = os.environ.get("READTHEDOCS_VERSION", "latest").rstrip("/")

html_context = {
    "source_type": "github",
    "source_user": "baseplate-admin",
    "source_repo": "django-hstore-widget",
    "edit_page_url_template": "apps/docs/{filename}",
    "languages": [
        ("English", f"/en/{_rtd_version}/%s.html", "en"),
        ("বাংলা", f"/bn/{_rtd_version}/%s.html", "bn"),
        ("日本語", f"/ja/{_rtd_version}/%s.html", "ja"),
        ("中文", f"/zh/{_rtd_version}/%s.html", "zh"),
        ("മലയാളം", f"/ml/{_rtd_version}/%s.html", "ml"),
        ("हिन्दी", f"/hi/{_rtd_version}/%s.html", "hi"),
        ("Español", f"/es/{_rtd_version}/%s.html", "es"),
        ("Français", f"/fr/{_rtd_version}/%s.html", "fr"),
        ("العربية", f"/ar/{_rtd_version}/%s.html", "ar"),
        ("Русский", f"/ru/{_rtd_version}/%s.html", "ru"),
        ("Português", f"/pt/{_rtd_version}/%s.html", "pt"),
        ("Deutsch", f"/de/{_rtd_version}/%s.html", "de"),
        ("한국어", f"/ko/{_rtd_version}/%s.html", "ko"),
        ("Türkçe", f"/tr/{_rtd_version}/%s.html", "tr"),
        ("Italiano", f"/it/{_rtd_version}/%s.html", "it"),
        ("Polski", f"/pl/{_rtd_version}/%s.html", "pl"),
        ("Tiếng Việt", f"/vi/{_rtd_version}/%s.html", "vi"),
        ("Bahasa Indonesia", f"/id/{_rtd_version}/%s.html", "id"),
        ("فارسی", f"/fa/{_rtd_version}/%s.html", "fa"),
        ("ไทย", f"/th/{_rtd_version}/%s.html", "th"),
        ("Українська", f"/uk/{_rtd_version}/%s.html", "uk"),
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
    "django_admin_icons",
]

source_suffix = {
    ".rst": "restructuredtext",
}

templates_path = ["_templates"]
html_static_path = ["static"]
html_css_files = []
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

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
