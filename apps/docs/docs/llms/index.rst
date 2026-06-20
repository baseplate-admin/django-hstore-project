LLM Context Files
=================

This project provides machine-readable context files for LLM integration,
auto-generated during the Sphinx documentation build.

Available Files
---------------

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - File
     - Description
   * - `llms.txt <../../llms.txt>`_
     - Index file listing all context files
   * - `llms-widget.txt <../../llms-widget.txt>`_
     - django-hstore-widget package: widget API, frontend architecture
   * - `llms-field.txt <../../llms-field.txt>`_
     - django-hstore-field package: field API, installation, quick start
   * - `llms-full.txt <../../llms-full.txt>`_
     - Complete project documentation including all packages, API reference, architecture, best practices, and contributing guide

Usage
-----

Point your LLM to the context file that matches your scope. The generated files
are placed at the root of the documentation output and are accessible relative
to the docs root.

How It Works
------------

The llms.txt files are generated automatically by a custom Sphinx extension
(``llms_txt_generator``) that assembles content from all documentation source
files at build time, ensuring the context files stay in sync with the
documentation.
