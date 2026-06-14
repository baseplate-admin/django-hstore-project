// scope-controller.ts
import { ReactiveController, ReactiveControllerHost } from 'lit';
import { isScopeActive } from './scope';

export class ScopeController implements ReactiveController {
    private host: ReactiveControllerHost & HTMLElement;
    private parentTag: string;

    constructor(host: ReactiveControllerHost & HTMLElement, parentTag: string) {
        this.host = host;
        this.parentTag = parentTag;
        host.addController(this);
    }

    hostConnected() {
        const parent = this.host.closest(this.parentTag);

        if (!parent) {
            throw new Error(`<${this.host.localName}> must be inside <${this.parentTag}>`);
        }

        // Hook INTO Lit lifecycle BEFORE first update
        this.host.requestUpdate();

        if (!isScopeActive(this.parentTag)) {
            throw new Error(`<${this.host.localName}> scope inactive (parent not registered)`);
        }
    }

    hostUpdate() {
        // This runs BEFORE every render cycle
        if (!isScopeActive(this.parentTag)) {
            throw new Error(`<${this.host.localName}> blocked during update (scope lost)`);
        }
    }

    hostDisconnected() {
        // optional cleanup hook
    }
}
