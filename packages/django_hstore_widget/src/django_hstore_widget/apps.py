from django.apps import AppConfig


class DjangoHStoreWidgetConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "django_hstore_widget"

    def ready(self):
        from . import checks as checks
