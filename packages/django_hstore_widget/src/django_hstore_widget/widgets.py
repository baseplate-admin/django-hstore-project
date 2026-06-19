import logging

from django.contrib.admin.widgets import AdminTextareaWidget
from django.template.loader import get_template
from django.utils.html import format_html, html_safe
from django.utils.safestring import mark_safe

try:
    # Django 2.x
    from django.contrib.admin.templatetags.admin_static import static
except ImportError:
    from django.templatetags.static import static

logger = logging.getLogger("django_hstore_widget")


@html_safe
class Asset:
    """A generic asset reference that resolves to a static file path.

    Used by the widget ``Media`` class to declare JavaScript and CSS
    dependencies. Subclasses like :class:`ESM` render the asset as
    HTML instead of a plain path.
    """

    def __init__(self, path):
        """Initialize with a path relative to the static root."""
        self.path = path

    def absolute_path(self, path):
        """Return the fully resolved URL for *path*.

        Paths starting with ``http://``, ``https://``, or ``/`` are
        returned as-is. All other paths are resolved through Django's
        ``static()`` helper.
        """
        if path.startswith(("http://", "https://", "/")):
            return path
        return static(path)

    def __str__(self):
        return self.absolute_path(self.path)


class ESM(Asset):
    """An ECMAScript module asset.

    Renders as a ``<script type="module">`` tag so the browser loads
    the widget as an ES module.
    """

    def __str__(self):
        path = super().__str__()
        return format_html('<script src="{}" type="module"></script>', path)


class HStoreFormWidget(AdminTextareaWidget):
    """Django admin widget that renders the custom hstore editor.

    Replaces the default textarea with a Lit-based key-value editor
    component.  Loads the widget JavaScript as an ES module via the
    ``Media`` inner class.

    Example
    -------
    >>> from django_hstore_widget.widgets import HStoreFormWidget
    >>> widget = HStoreFormWidget()
    """

    def render(self, name, value, attrs=None, renderer=None):
        """Render the widget HTML for a given form field.

        Parameters
        ----------
        name : str
            The HTML ``name`` attribute for the field.
        value : dict or None
            The current hstore data as a key-value mapping.
        attrs : dict, optional
            Additional HTML attributes passed to the template.
        renderer : ~django.template.backends.base.TemplateRenderer, optional
            Template renderer instance.

        Returns
        -------
        str
            The rendered HTML markup for the widget.
        """
        template_context = {
            "field_name": name,
            "field_data": value or {},
        }
        template = get_template("django_hstore_widget.html")
        html = template.render(template_context)
        return mark_safe(html)

    class Media:
        js = [ESM("admin/js/django_hstore_widget/django-hstore-widget.js")]
