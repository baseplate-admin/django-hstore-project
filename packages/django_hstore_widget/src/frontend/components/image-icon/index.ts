import { getState, subscribe } from '$store/image';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { Pencil, Plus, X } from 'lucide-static';

const LUCIDE_FALLBACK = { delete: X, add: Plus, edit: Pencil } as const;

const ICON_DEFINITIONS = {
    delete: { attributeSource: 'delete_svg_src', accessibilityLabel: '❌', fallback: LUCIDE_FALLBACK.delete },
    add: { attributeSource: 'add_svg_src', accessibilityLabel: '➕', fallback: LUCIDE_FALLBACK.add },
    edit: { attributeSource: 'edit_svg_src', accessibilityLabel: '✏️', fallback: LUCIDE_FALLBACK.edit },
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

        if (resolvedImageSource) {
            return html`<img src="${resolvedImageSource}" alt="${iconDefinition.accessibilityLabel}" />`;
        }

        return html`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-label="${iconDefinition.accessibilityLabel}"
            dangerouslySetInnerHTML=${{ __html: iconDefinition.fallback }}
        ></svg>`;
    }
}

// Register as custom element
customElements.define('image-icon', ImageIconComponent);
