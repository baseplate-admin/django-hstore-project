Contributing
============

Step-by-step guide to setting up your development environment and contributing
to django-hstore-project.

Prerequisites
-------------

Make sure you have the following installed:

- **Python 3.10+** with ``uv`` package manager
- **Node.js 18+** with ``npm``
- **PostgreSQL 14+** running locally

Clone the Repository
--------------------

.. code-block:: bash

   git clone https://github.com/baseplate-admin/django-hstore-project.git
   cd django-hstore-project

Install Python Dependencies
----------------------------

.. code-block:: bash

   uv sync --group test

This installs all Python packages including test dependencies.

Install Frontend Dependencies
-----------------------------

.. code-block:: bash

   cd packages/django_hstore_widget
   npm install

This installs Lit, Vite, and all frontend tooling.

Set Up the Database
-------------------

Start a local PostgreSQL instance with the hstore extension enabled:

.. tabs::

   .. tab:: Django ORM

      .. code-block:: bash

         python manage.py migrate

   .. tab:: SQL

      .. code-block:: bash

         psql -c "CREATE DATABASE django_hstore_dev;"
         psql -d django_hstore_dev -c "CREATE EXTENSION hstore;"

Run the Tests
-------------

Frontend Tests
~~~~~~~~~~~~~~

.. code-block:: bash

   # Unit tests
   npm run test:jest

   # End-to-end tests
   npm test

Backend Tests
~~~~~~~~~~~~~

.. code-block:: bash

   # Widget package tests
   uv run pytest packages/django_hstore_widget/tests/ -v

   # Field package tests
   uv run pytest packages/django_hstore_field/tests/ -v

Type Checking
~~~~~~~~~~~~~

.. code-block:: bash

   # TypeScript types
   npm run typecheck

Build the Project
-----------------

.. code-block:: bash

   # Build frontend
   npm run build

   # Build widget Python package
   cd packages/django_hstore_widget && hatch build

   # Build field Python package
   cd packages/django_hstore_field && hatch build

Start the Dev Server
--------------------

.. code-block:: bash

   npm run dev

The dev server runs on port 9100 with hot module replacement enabled.

Code Style
----------

- **Python**: Ruff (linter + formatter)
- **TypeScript**: Prettier
- Pre-commit hooks are configured for automated formatting

Before submitting a pull request, run:

.. code-block:: bash

   # Format Python code
   uv run ruff check --fix
   uv run ruff format

   # Format TypeScript code
   npm run format
