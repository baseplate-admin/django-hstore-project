import os

import django
import pytest
from django.conf import settings

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright


@pytest.fixture
def page():
    if sync_playwright is None:
        pytest.skip("Playwright is not installed for this Python runtime")

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 1920, "height": 1200})
            browser_page = context.new_page()
            yield browser_page
            context.close()
            browser.close()
    except PlaywrightError as exc:
        pytest.skip(str(exc))


def pytest_sessionstart(session):
    if settings.configured:
        return

    settings.configure(
        DATABASES={
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": os.environ.get("DJANGO_DATABASE_NAME", "postgres"),
                "HOST": os.environ.get("DJANGO_DATABASE_HOST", "localhost"),
                "USER": os.environ.get("DJANGO_DATABASE_USER", "postgres"),
                "PASSWORD": os.environ.get(
                    "DJANGO_DATABASE_PASSWORD", "supersecretpassword"
                ),
            },
        },
        INSTALLED_APPS=(
            "django.contrib.admin",
            "django.contrib.auth",
            "django.contrib.contenttypes",
            "django.contrib.sessions",
            "django.contrib.messages",
            "django.contrib.staticfiles",
            "django.contrib.postgres",
            "django_hstore_widget",
            "cat",
        ),
        MIDDLEWARE=[
            "django.middleware.security.SecurityMiddleware",
            "django.contrib.sessions.middleware.SessionMiddleware",
            "django.middleware.common.CommonMiddleware",
            "django.middleware.csrf.CsrfViewMiddleware",
            "django.contrib.auth.middleware.AuthenticationMiddleware",
            "django.contrib.messages.middleware.MessageMiddleware",
            "django.middleware.clickjacking.XFrameOptionsMiddleware",
        ],
        SECRET_KEY="secret",
        BASE_DIR=os.path.dirname(os.path.dirname(__file__)),
        DEBUG=True,
        LANGUAGE_CODE="en-us",
        TIME_ZONE="UTC",
        USE_I18N=True,
        USE_TZ=True,
        STATIC_URL="/static/",
        ROOT_URLCONF="cat.urls",
        ALLOWED_HOSTS=["*"],
        TEMPLATES=[
            {
                "BACKEND": "django.template.backends.django.DjangoTemplates",
                "DIRS": [],
                "APP_DIRS": True,
                "OPTIONS": {
                    "context_processors": [
                        "django.template.context_processors.debug",
                        "django.template.context_processors.request",
                        "django.contrib.auth.context_processors.auth",
                        "django.contrib.messages.context_processors.messages",
                    ],
                },
            },
        ],
    )
    django.setup()
