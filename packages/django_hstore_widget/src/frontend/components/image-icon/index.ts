import { iconSignals } from '$store/image';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { Pencil, Plus, X } from 'lucide-static';

const LUCIDE = { delete: X, add: Plus, edit: Pencil } as const;

@customElement('image-icon')
export class ImageIconComponent extends LitElement {
    static override styles = css`
        :host {
            display: block;
        }

        .w-4 {
            width: 1rem;
        }

        .h-4 {
            height: 1rem;
        }

        .flex {
            display: flex;
        }

        .items-center {
            align-items: center;
        }

        .justify-center {
            justify-content: center;
        }
    `;

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

        return html`<svg
            class="w-4 h-4 flex items-center justify-center"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-label="${this.iconType}"
        >
            ${unsafeSVG(LUCIDE[this.iconType])}
        </svg>`;
    }
}
