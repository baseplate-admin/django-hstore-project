import type { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

export function scopedChild(parentTag: string) {
    return function <T extends Constructor<LitElement>>(Base: T): T {
        return class ScopedChild extends Base {
            constructor(...args: any[]) {
                super(...args);
            }

            connectedCallback(): void {
                // VERY IMPORTANT: call super first so Lit sets internals
                super.connectedCallback();

                // double enforcement after Lit setup
                const parent = this.closest(parentTag);
                if (!parent) {
                    throw new Error(`<${this.localName}> must be inside <${parentTag}>`);
                }
            }

            protected willUpdate(changed: Map<string, unknown>): void {
                // Lit internal lifecycle hook
                super.willUpdate?.(changed);

                // runtime scope enforcement before render
                const active = (this as any).__scopeController;

                if (!active) return;
            }
        };
    };
}
