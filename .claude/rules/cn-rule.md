---
description: Use Lit classMap directive for conditional classes; keep static class strings inline.
glob: "**/*.{ts,tsx,js,jsx}"
---

# Class Handling Rule (Lit classMap)

Use Lit's `classMap` directive from `lit/directives/class-map.js` for conditional class names.

## ✅ Conditional classes with classMap

```ts
import { classMap } from 'lit/directives/class-map.js';

class=${classMap({
    'flex items-center cursor-pointer': true,
    'invisible': this.displayMode !== 'rows',
    'warning': this.parseError,
})}
```

## ✅ Static classes inline

Do NOT wrap static class strings with classMap:

```ts
class="flex items-center justify-center gap-1"
```

## ✅ Dynamic attribute with ifDefined

```ts
import { ifDefined } from 'lit/directives/if-defined.js';

title=${ifDefined(this.optionalTitle)}
```

## Principle

- Use `classMap` when class names depend on boolean conditions
- Keep static class strings inline for readability
- Use `ifDefined` for optional attribute values
- Use `styleMap` for conditional inline styles
- Use `repeat` for list rendering instead of `.map()`
