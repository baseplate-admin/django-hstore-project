# Read the Docs configuration file v2 (summary)

Use this as a quick reference when writing `.readthedocs.yaml`.
The file lives at the repo root by default (or a configured subdirectory for monorepos).
When using v2, settings in the web interface are ignored.

## Required

- `version: 2`

## formats

- List of extra formats to build: `htmlzip`, `pdf`, `epub`, or `all`.
- Default: `[]` (HTML only).
- Only Sphinx supports extra formats. For pull request builds, only HTML is produced.

## python

`python.install` is a list of install entries. Each item is one of:

- Requirements file:
  - `requirements: path/to/requirements.txt`
- Package install:
  - `method: pip` (default)
  - `path: .` (package path)
  - `extra_requirements: [docs, ...]` (optional extras)

## conda

- `conda.environment: path/to/environment.yml`
- When using conda, also set `build.tools.python` to a conda or mamba value.

## build

### build.os

- Required when using `build.jobs` or `build.commands`.
- Options: `ubuntu-20.04`, `ubuntu-22.04`, `ubuntu-24.04`, `ubuntu-lts-latest`.

### build.tools

- Required when using `build.jobs` or `build.commands`.
- Include one or more tool versions. Keys: `python`, `nodejs`, `ruby`, `rust`, `golang`.
- Use `latest` if needed, but it can break builds when updated.

### build.apt_packages

- List of Ubuntu packages to install.
- Not supported when using `build.commands`.

### build.jobs

- Map of steps to command lists. Allowed keys:
  - `post_checkout`, `pre_system_dependencies`, `post_system_dependencies`,
    `pre_create_environment`, `create_environment`, `post_create_environment`,
    `pre_install`, `post_install`, `pre_build`, `build`, `post_build`
- `build` can be a map of formats (`html`, `pdf`, `epub`, `htmlzip`) to command lists.
- Write outputs to `$READTHEDOCS_OUTPUT/<format>/`.

### build.commands

- List of commands to run instead of pre-defined build jobs.
- Requires `build.os` and `build.tools`.
- Each command runs in a clean shell and starts in the repo root.

## sphinx

- `sphinx.configuration: path/to/conf.py` (required)
- `sphinx.builder`: `html`, `dirhtml`, `singlehtml` (default `html`)
- `sphinx.fail_on_warning`: boolean

## mkdocs

- `mkdocs.configuration: path/to/mkdocs.yml` (required)
- `mkdocs.fail_on_warning`: boolean

## submodules

- `submodules.include`: list or `all`
- `submodules.exclude`: list or `all`
- `submodules.recursive`: boolean
- Do not use `include` and `exclude` together.

## search

- `search.ranking`: map of glob patterns to rank (-10 to 10)
- `search.ignore`: list of glob patterns (defaults include `search.html`, `404.html`, etc.)

## Schema

- Repo schema: `readthedocs/rtd_tests/fixtures/spec/v2/schema.json`
- Use Schema Store for editor validation and autocompletion.
