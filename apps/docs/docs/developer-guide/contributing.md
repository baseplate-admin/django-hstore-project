# Contributing

Step-by-step guide to setting up your development environment and contributing
to django-hstore-project.

## Prerequisites

Make sure you have the following installed:

- **Python 3.10+** with ``uv`` package manager
- **Node.js 18+** with ``npm``
- **PostgreSQL 14+** running locally

## Clone the Repository

```{eval-rst}
.. termynal::
   $ git clone https://github.com/baseplate-admin/django-hstore-project.git
   Cloning into 'django-hstore-project'...
   $ cd django-hstore-project
```

## Install Python Dependencies

```{eval-rst}
.. termynal::
   $ uv sync --group test
   -->
   Resolved 69 packages in 12ms
   Preparing 5 packages in 3.2s
   Installed 5 packages in 8ms
```

This installs all Python packages including test dependencies.

## Install Frontend Dependencies

```{eval-rst}
.. termynal::
   $ cd packages/django_hstore_widget
   $ npm install
   -->
   added 412 packages in 18s
   45 packages are looking for funding
     run `npm fund` for details
```

This installs Lit, Vite, and all frontend tooling.

## Set Up the Database

Start a local PostgreSQL instance with the hstore extension enabled:

```{eval-rst}
.. tabs::

   .. tab:: Django ORM

      .. termynal::
         $ python manage.py migrate
         -->
         Operations to perform:
           Apply all migrations: admin, auth, contenttypes, sessions
         Running migrations:
           Applying contenttypes.0001_initial... OK
           Applying auth.0001_initial... OK
         All migrations completed.

   .. tab:: SQL

      .. termynal::
         $ psql -c "CREATE DATABASE django_hstore_dev;"
         -->
         CREATE DATABASE
         $ psql -d django_hstore_dev -c "CREATE EXTENSION hstore;"
         -->
         CREATE EXTENSION
```

## Run the Tests

### Frontend Tests

```{eval-rst}
.. termynal::
   $ npm run test:jest
   -->
   PASS tests/widget.test.ts
   PASS tests/parser.test.ts
   Test Suites: 2 passed, 2 total
   Tests:       14 passed, 14 total
   $ npm test
   -->
   Running 2 tests using 2 workers
   ✓ e2e/widget.spec.ts (1.2s)
   2 passed (1.5s)
```

### Backend Tests

```{eval-rst}
.. termynal::
   $ uv run pytest packages/django_hstore_widget/tests/ -v
   -->
   test_widget_render.py::test_widget_media PASSED
   test_widget_render.py::test_widget_value PASSED
   test_widget_render.py::test_widget_init PASSED
   ================= 3 passed in 0.12s =================
   $ uv run pytest packages/django_hstore_field/tests/ -v
   -->
   test_field.py::test_hstore_field_formfield PASSED
   test_field.py::test_hstore_field_deconstruct PASSED
   ================= 2 passed in 0.08s =================
```

### Type Checking

```{eval-rst}
.. termynal::
   $ npm run typecheck
   -->
   Found 0 errors.
```

## Build the Project

```{eval-rst}
.. termynal::
   $ npm run build
   -->
   vite v5.4.19 building for production...
   transforming...
   12 modules transformed.
   rendering chunks...
   computed gzip sizes:
   admin/js/django_hstore_widget/django-hstore-widget.js  24.12 kB │ gzip: 8.34 kB
   ✓ built in 342ms
```

## Start the Dev Server

```{eval-rst}
.. termynal::
   $ npm run dev
   -->
   ➜  Local:   http://localhost:9100/
   ➜  press h + enter to show help
```

The dev server runs on port 9100 with hot module replacement enabled.

## Code Style

- **Python**: Ruff (linter + formatter)
- **TypeScript**: Prettier
- Pre-commit hooks are configured for automated formatting

Before submitting a pull request, run:

```{eval-rst}
.. termynal::
   $ uv run ruff check --fix
   -->
   All checks passed!
   $ uv run ruff format
   -->
   12 files left unchanged.
   $ npm run format
   -->
   Checked 12 files.
```
