import { getState, subscribe } from '$store/image';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

const ICON_DEFINITIONS = {
    delete: { attributeSource: 'delete_svg_src', accessibilityLabel: '❌' },
    add: { attributeSource: 'add_svg_src', accessibilityLabel: '➕' },
    edit: { attributeSource: 'edit_svg_src', accessibilityLabel: '✏️' },
} as const;

export class ImageIconComponent extends LitElement {
    protected override createRenderRoot(): this {
        return this;
    }

    @property({ type: String, reflect: true })
    iconType: keyof typeof ICON_DEFINITIONS = 'delete';

    #unsubscribeStoreUpdates = () => {};

    override connectedCallback(): void {
        super.connectedCallback();
        this.#unsubscribeStoreUpdates = subscribe(() => {
            this.requestUpdate();
        });
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#unsubscribeStoreUpdates();
    }

    protected override render() {
        const storeState = getState();
        const iconDefinition = ICON_DEFINITIONS[this.iconType];
        const resolvedImageSource = storeState[iconDefinition.attributeSource] ?? '';

        return html`<img src="${resolvedImageSource}" alt="${iconDefinition.accessibilityLabel}" />`;
    }
}
