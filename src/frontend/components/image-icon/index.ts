import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { subscribe, getState } from '$store/image';

const ICONS = {
    delete: { src: 'delete_svg_src', alt: '❌' },
    add: { src: 'add_svg_src', alt: '➕' },
    edit: { src: 'edit_svg_src', alt: '✏️' },
} as const;

@customElement('image-icon')
export class ImageIcon extends LitElement {
    override createRenderRoot() {
        return this;
    }

    @property({ type: String, reflect: true })
    type: keyof typeof ICONS = 'delete';

    #unsub = () => {};

    override connectedCallback() {
        super.connectedCallback();
        this.#unsub = subscribe(() => this.requestUpdate());
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.#unsub();
    }

    override render() {
        const st = getState();
        const icon = ICONS[this.type];
        const src = st[icon.src] ?? '';
        return html`<img src="${src}" alt="${icon.alt}" />`;
    }
}
