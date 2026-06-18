---
description: Always use Lit's @customElement decorator instead of customElements.define() to register web components.
glob: "*.ts"
---

# Use @customElement Decorator for Lit Components

Always use Lit's `@customElement` decorator to register web components instead of calling `customElements.define()` manually.

```ts
import { customElement } from 'lit/decorators.js';

@customElement('my-tag')
export class MyTag extends LitElement { }
```

Never use `customElements.define('my-tag', MyTag)` outside the class.
