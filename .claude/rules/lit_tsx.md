---
description: Lit TSX project. Treat TSX as Lit components and never as React components.
globs:
  - "**/*.ts"
  - "**/*.tsx"
---


## Lit TSX, Not React

This codebase uses **Lit with TSX**. All `.tsx` files are Lit components unless explicitly stated otherwise.

- Never assume React.
- Never import or suggest `react`, `react-dom`, `preact`, hooks, JSX runtime, context, refs, or React component patterns.
- Use only Lit APIs (`LitElement`, `html`, `css`, decorators, directives, controllers, reactive properties, Web Components APIs, etc.).
- TSX syntax is used exclusively for Lit templates and custom elements.
- Preserve Lit semantics when editing existing TSX.
- Generate Lit-compatible code only.
- All Lit patterns, directives, decorators, and Web Component features are allowed.
- If TSX code resembles React JSX, interpret it as Lit TSX, not React JSX.
- Never convert Lit code into React code.