from django.core.checks import Warning, register


@register
def check_database_backend_is_postgres(app_configs, **kwargs):
    """System check that warns when the default DB backend is not PostgreSQL.

    HStore requires the ``hstore`` extension, which is only available
    on PostgreSQL.  This check runs during ``manage.py check`` and
    ``manage.py migrate``.

    Parameters
    ----------
    app_configs : list
        The application configurations being checked.
    **kwargs
        Additional keyword arguments from the check runner.

    Returns
    -------
    list[Warning]
        A list containing a warning if the default database engine
        does not include ``postgres`` or ``postgis``.
    """
    from django.conf import settings

    errors = []
    valid_dbs = ["postgres", "postgis"]

    if "default" in settings.DATABASES and all(d not in settings.DATABASES["default"]["ENGINE"] for d in valid_dbs):
        errors.append(
            Warning(
                "django_hstore_widget needs postgres to support install the hstore extension.",
                hint="Use the postgres engine or ignore if you already use a custom engine for postgres",
            )
        )

    return errors
