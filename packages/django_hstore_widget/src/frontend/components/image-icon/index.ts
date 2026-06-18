import { StyleFactory } from '$composite_classes/style';
import appStyles from '$css/app.css?inline';
import { iconSignals } from '$store/image';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Pencil, Plus, X } from 'lucide-static';

const LUCIDE = { delete: X, add: Plus, edit: Pencil } as const;

@customElement('image-icon')
export class ImageIconComponent extends LitElement {
    #styleFactory = new StyleFactory();

    firstUpdate() {
        this.#styleFactory.mountStyles(this.renderRoot, appStyles);
    }
    override createRenderRoot() {
        return this;
    }

    @property({ type: String, reflect: true })
    iconType: keyof typeof LUCIDE = 'delete';

    #unsubscribe = () => {};

    override connectedCallback() {
        super.connectedCallback();
        this.#unsubscribe = iconSignals[this.iconType].subscribe(() => this.requestUpdate());
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.#unsubscribe();
    }

    render() {
        const src = iconSignals[this.iconType].value;

        if (src) {
            return html`<img src="${src}" class="w-4 h-4" alt="${this.iconType}" />`;
        }

        return html`<svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-label="${this.iconType}"
        >
            ${unsafeHTML(LUCIDE[this.iconType])}
        </svg>`;
    }
}
