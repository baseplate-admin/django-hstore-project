import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { subscribe, getState } from '$store/image';

@customElement('image-icon')
class ImageIcon extends LitElement {
    @property({ type: String, reflect: true })
    type: 'delete' | 'add' | 'edit' = 'delete';

    private _unsubscribe = () => {};

    override connectedCallback() {
        super.connectedCallback();
        this._unsubscribe = subscribe(() => {
            this.requestUpdate();
        });
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe();
    }

    override render() {
        const store = getState();
        const mapping: Record<string, { src: string; alt: string }> = {
            delete: { src: store.delete_svg_src, alt: 'delete' },
            add: { src: store.add_svg_src, alt: 'add' },
            edit: { src: store.edit_svg_src, alt: 'edit' },
        };
        const icon = mapping[this.type];
        if (!icon?.src) {
            console.debug(`Icon type "${this.type}" src is not yet set`);
        }

        return html`<img src="${icon?.src ?? ''}" alt="${icon?.alt ?? ''}" />`;
    }
}

export { ImageIcon };
