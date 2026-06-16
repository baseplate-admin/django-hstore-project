import type { LitElement } from 'lit';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { isScopeActive, enterScope, exitScope } from './scope';

type Constructor<T = {}> = new (...args: any[]) => T;

// --- Registry ---

interface FactoryEntry {
    tag: string;
    seq: number;
    refCount: number;
    scopeKey: string;
}

const registry = new Map<string, FactoryEntry>();

export function getRegistryInfo(): ReadonlyMap<string, FactoryEntry> {
    return registry;
}

// --- Lit internal controller: ref counting + scope lifecycle ---

class RefCountController implements ReactiveController {
    private readonly host: ReactiveControllerHost & HTMLElement;
    private readonly scopeKey: string;
    private readonly entryTag: string;

    constructor(host: ReactiveControllerHost & HTMLElement, scopeKey: string, entryTag: string) {
        this.host = host;
        this.scopeKey = scopeKey;
        this.entryTag = entryTag;
        host.addController(this);
    }

    hostConnected() {
        const entry = registry.get(this.entryTag);
        if (entry) entry.refCount++;
        enterScope(this.scopeKey);

        const parent = this.host.closest(this.scopeKey);
        if (!parent) {
            throw new Error(`<${(this.host as Element).localName}> must be inside <${this.scopeKey}>`);
        }
    }

    hostUpdate() {
        if (!isScopeActive(this.scopeKey)) {
            throw new Error(`<${(this.host as Element).localName}> scope "${this.scopeKey}" inactive`);
        }
    }

    hostDisconnected() {
        const entry = registry.get(this.entryTag);
        if (entry && entry.refCount > 0) entry.refCount--;
        exitScope(this.scopeKey);
    }
}

// --- Decorator: factory-managed scoped component with ref counting ---

function factoryScoped(scopeKey: string, entryTag: string) {
    return function <T extends Constructor<LitElement>>(Base: T): T {
        return class FactoryScopedComponent extends Base {
            constructor(...args: any[]) {
                super(...args);
                new RefCountController(this, scopeKey, entryTag);
            }

            connectedCallback() {
                super.connectedCallback();
                const parent = this.closest(scopeKey);
                if (!parent) {
                    throw new Error(`<${this.localName}> must be inside <${scopeKey}>`);
                }
            }
        } as T;
    };
}

// --- Icon registration ---

let instanceCounter = 0;

const TAG = 'image-icon';
const SCOPE = 'django-hstore-widget';

function registerIcon(Base: Constructor<LitElement>): void {
    const uuid = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    const entryId = `${TAG}-${instanceCounter++}-${uuid}`;

    registry.set(entryId, { tag: TAG, seq: instanceCounter, refCount: 0, scopeKey: SCOPE });

    const Decorated = factoryScoped(SCOPE, entryId)(Base);
    customElements.define(TAG, Decorated);
}

export { registerIcon, TAG, SCOPE };
