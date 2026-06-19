from django.apps import AppConfig


class DjangoHStoreWidgetConfig(AppConfig):
    """Application configuration for django-hstore-widget.

    Registers the PostgreSQL backend check on app ready so that
    non-PostgreSQL setups receive a warning during system checks.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "django_hstore_widget"

    def ready(self):
        # noqa: F401 -- import registers the check via @register
        from . import checks  # noqa: F401
