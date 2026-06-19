---
name: readthedocs-build-optimization
description: Optimize Read the Docs build performance and resource usage. Use when Read the Docs builds are slow, timing out, or hitting memory limits, or when users want to speed up builds by adjusting formats, dependencies, conda/mamba usage, or Python API documentation strategy.
---

# Read the Docs Build Optimization

## Overview

Diagnose and speed up slow Read the Docs builds by reducing output formats and
dependencies, choosing faster build tooling, and lowering API documentation
overhead. Prefer minimal, low-risk configuration changes first.

## Required inputs

- Build URL or raw logs (timing, memory errors, or timeouts).
- `.readthedocs.yaml` and documentation dependency files.
- Documentation toolchain (Sphinx or MkDocs) and whether `sphinx.ext.autodoc` is in use.
- Output formats currently enabled.

## Workflow

1. Confirm symptoms and scope.
2. Apply low-risk optimizations first.
3. Optimize the build environment when conda is involved.
4. Reduce API documentation overhead if autodoc drives dependency load.
5. Escalate by requesting more resources only after optimization changes.

## Optimization checklist

- Reduce output formats, especially `htmlzip`, before deeper changes.
- Separate documentation dependencies from application dependencies.
- Prefer `mamba` over `conda` to speed up solves and reduce memory usage.
- Consider static API documentation tooling for heavy autodoc builds.
- If changes are insufficient, guide the user to request more resources.

## References

- Read `references/slow-builds-troubleshooting.md` before making recommendations.
- Docs: https://docs.readthedocs.com/platform/stable/guides/build-using-too-many-resources.html
- Docs: https://docs.readthedocs.com/platform/stable/builds.html#build-resources
- Keep suggestions aligned with the troubleshooting guide and propose the smallest change set first.
