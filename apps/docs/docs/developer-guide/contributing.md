# Contributing

## Development Setup

```bash
# Clone the repo
git clone https://github.com/baseplate-admin/django-hstore-project.git
cd django-hstore-project

# Install Python dependencies
uv sync --group test

# Install frontend dependencies
cd packages/django_hstore_widget
npm install
```

## Running Tests

```bash
# Frontend unit tests
npm run test:jest

# Frontend e2e tests
npm test

# Backend tests (widget)
uv run pytest packages/django_hstore_widget/tests/ -v

# Backend tests (field)
uv run pytest packages/django_hstore_field/tests/ -v

# Type checking
npm run typecheck
```

## Building

```bash
# Build frontend
npm run build

# Build Python package (widget)
cd packages/django_hstore_widget && hatch build

# Build Python package (field)
cd packages/django_hstore_field && hatch build
```

## Code Style

- Python: Ruff (linter + formatter)
- TypeScript: Prettier
- Pre-commit hooks configured for automated formatting
