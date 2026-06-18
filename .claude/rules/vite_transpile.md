---
description: Always use Vite with esbuild for transpiling TypeScript files; never fall back to Babel, swc, or ts-loader.
glob: '*'
---

# Vite for TS Transpilation

Always use Vite with esbuild for transpiling TypeScript files.
Never replace Vite with webpack, Babel, swc, ts-loader, or other bundlers/transpilers for TS files.
If Vite has issues, fix the Vite config — do not switch bundlers.
