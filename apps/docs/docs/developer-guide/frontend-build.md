# Frontend Build Pipeline

## Overview

The widget frontend is built with webpack and TypeScript, producing a single JS bundle loaded as an ESM module by Django admin.

## Build Steps

1. webpack bundles `src/frontend/index.ts` into `dist/components/django-hstore-widget.js`
2. `scripts/copy.ts` copies the bundle to `src/django_hstore_widget/static/admin/js/django_hstore_widget/`
3. Django serves the bundle via static files

## Configuration

- **webpack.config.ts** — Entry point, output, loaders, dev server
- **tsconfig.json** — TypeScript compiler options, path aliases
- **babel.config.ts** — Babel presets for Jest transforms
- **jest.config.ts** — Jest test configuration
- **playwright.config.ts** — Playwright e2e test configuration

## Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `$lib/*` | `src/frontend/lib/*` |
| `$store/*` | `src/frontend/stores/*` |
| `$mappping/*` | `src/frontend/mappings/*` |
| `$components/*` | `src/frontend/components/*` |

## Development

```bash
# Start dev server
npm run dev

# The dev server runs on port 9100 with HMR
```
