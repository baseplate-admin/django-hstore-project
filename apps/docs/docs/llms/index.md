# LLM Context Files

This project provides machine-readable context files for LLM integration, auto-generated during the Sphinx documentation build.

## Available Files

| File | Description |
|------|-------------|
| [llms.txt](https://django-hstore-widget.readthedocs.io/en/latest/llms.txt) | Index file listing all context files |
| [llms-widget.txt](https://django-hstore-widget.readthedocs.io/en/latest/llms-widget.txt) | django-hstore-widget package: widget API, frontend architecture |
| [llms-field.txt](https://django-hstore-widget.readthedocs.io/en/latest/llms-field.txt) | django-hstore-field package: field API, installation, quick start |
| [llms-full.txt](https://django-hstore-widget.readthedocs.io/en/latest/llms-full.txt) | Complete project documentation including all packages, API reference, architecture, best practices, and contributing guide |

## Usage

Point your LLM to the context file that matches your scope:

```
https://django-hstore-widget.readthedocs.io/en/latest/llms-full.txt
```

## How It Works

The llms.txt files are generated automatically by a custom Sphinx extension (`llms_txt_generator`) that assembles content from all documentation source files at build time, ensuring the context files stay in sync with the documentation.
