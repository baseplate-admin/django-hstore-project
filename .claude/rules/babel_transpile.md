---
description: Always use Babel for transpiling TypeScript files; never replace Babel with esbuild, swc, or other transpilers for TS files.
glob: "*"
---

# Babel for TS Transpilation

Always use Babel (babel-loader) for transpiling TypeScript files.
Never replace Babel with esbuild, swc, ts-loader, or other transpilers for TS files.
If Babel has issues, fix the Babel config — do not switch transpilers.
