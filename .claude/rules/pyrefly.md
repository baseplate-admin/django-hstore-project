# Use Pyrefly for Type Checking

Always use pyrefly for Python type checking instead of pyright.
Pyrefly is a fork of pyright with improved type inference and stricter checks.

Run via `uv run pyrefly check packages/django_hstore_widget/src packages/django_hstore_field/src`.

Note: pyrefly auto-excludes hatch `src/` directories when run without arguments, so always pass the source paths explicitly.
