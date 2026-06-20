import { iconSignals } from '$store/image';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { Pencil, Plus, X } from 'lucide-static';

const LUCIDE = { delete: X, add: Plus, edit: Pencil } as const;

function applyIconStyle(svgString: string): string {
    return svgString;
}

@customElement('image-icon')
export class ImageIconComponent extends LitElement {
    override createRenderRoot() {
        return this;
    }

    @property({ type: String, attribute: 'type', reflect: true })
    iconType: keyof typeof LUCIDE | undefined;

    #unsubscribe = () => {};

    override connectedCallback() {
        super.connectedCallback();
        if (this.iconType) {
            this.#unsubscribe = iconSignals[this.iconType].subscribe(() => this.requestUpdate());
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.#unsubscribe();
    }

    render() {
        if (!this.iconType) return;

        const src = iconSignals[this.iconType].value;

        if (src) {
            return html`<img src="${src}" class="w-4 h-4" alt="${this.iconType}" />`;
        }

        return html`<icon class="w-4 h-4 flex items-center justify-center">${unsafeSVG(applyIconStyle(LUCIDE[this.iconType]))}</icon>`;
    }
}
