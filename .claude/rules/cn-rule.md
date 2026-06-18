---
description: Use `cn()` utility only for conditional class composition; keep static class strings inline.
glob: "**/*.{ts,tsx,js,jsx}"
---

# Class Handling Rule (cn usage discipline)

Use `cn()` (or equivalent class-merge utility) **only when class names are conditionally composed or dynamically combined**.

## ✅ Allowed usage (conditional or dynamic classes)

Use `cn()` when class names depend on expressions:

```ts
class=${cn(
  this.displayMode === 'rows'
    ? 'items-center select-none justify-center flex gap-1 cursor-pointer'
    : 'invisible'
)}
```
Or when merging static + conditional classes:

```ts
class=${cn(
  'items-center select-none justify-center flex gap-1 cursor-pointer',
  isActive && 'bg-blue-500'
)}
```


❌ Disallowed usage (static-only classes)

Do NOT wrap static class strings with cn() when there is no conditional logic:

```ts
class="items-center select-none justify-center flex gap-1 cursor-pointer"
```

Principle
* Use cn() only when it adds value (conditional logic or merging)
* Keep static class strings inline for readability
* Avoid unnecessary abstraction or function wrapping