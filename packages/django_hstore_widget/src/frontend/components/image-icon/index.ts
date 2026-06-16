import { getState, subscribe } from '$store/image';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { registerIcon, TAG } from '$registry/icon-factory';

export const ICON_DEFINITIONS = {
    delete: { attributeSource: 'delete_svg_src', accessibilityLabel: 'Delete' },
    add: { attributeSource: 'add_svg_src', accessibilityLabel: 'Add' },
    edit: { attributeSource: 'edit_svg_src', accessibilityLabel: 'Edit' },
} as const;

export class ImageIconBase extends LitElement {
    protected override createRenderRoot(): this {
        return this;
    }

    @property({ type: String, reflect: true, attribute: 'type' })
    iconType: keyof typeof ICON_DEFINITIONS = 'delete';

    #unsubscribeStoreUpdates = () => {};

    connectedCallback(): void {
        super.connectedCallback();
        this.#unsubscribeStoreUpdates = subscribe(() => {
            this.requestUpdate();
        });
    }

    disconnectedCallback(): void {
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

registerIcon(ImageIconBase);

export { TAG as ImageIconTag };
export { getRegistryInfo } from '$registry/icon-factory';
