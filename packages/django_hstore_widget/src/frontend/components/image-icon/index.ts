import { getState, subscribe } from '$store/image';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { scopedChild } from '$registry/scoped-child';
import { ScopeController } from '$registry/scope-controller';

const ICON_DEFINITIONS = {
    delete: { attributeSource: 'delete_svg_src', accessibilityLabel: 'Delete' },
    add: { attributeSource: 'add_svg_src', accessibilityLabel: 'Add' },
    edit: { attributeSource: 'edit_svg_src', accessibilityLabel: 'Edit' },
} as const;

@scopedChild('django-hstore-widget')
export class ImageIconComponent extends LitElement {
    protected override createRenderRoot(): this {
        return this;
    }

    #scopeController: ScopeController;

    @property({ type: String, reflect: true, attribute: 'type' })
    iconType: keyof typeof ICON_DEFINITIONS = 'delete';

    #unsubscribeStoreUpdates = () => {};

    override connectedCallback(): void {
        super.connectedCallback();
        this.#scopeController = new ScopeController(this, 'django-hstore-widget');
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
