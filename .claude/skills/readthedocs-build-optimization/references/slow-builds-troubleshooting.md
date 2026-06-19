# Troubleshooting slow builds (Read the Docs)

Source: https://docs.readthedocs.com/platform/stable/guides/build-using-too-many-resources.html

## Build limits

Read the Docs enforces build resource limits to protect shared build systems.
Use the Build resources reference for the current limits:
https://docs.readthedocs.com/platform/stable/builds.html#build-resources

## Recommended fixes (start with the lowest risk)

1. Reduce formats you are building.
2. Disable `htmlzip` if it is not required because it uses additional time and memory.
3. Split documentation dependencies into a dedicated requirements file instead of
   reusing the full application requirements.
4. Use `mamba` as a drop-in replacement for `conda` when conda packages are required.
5. If Sphinx API docs are generated with `sphinx.ext.autodoc`, consider
   `sphinx-autoapi` to produce API documentation statically and avoid heavy imports.
6. If optimizations do not help, request higher build limits from Read the Docs
   support with a clear justification.
