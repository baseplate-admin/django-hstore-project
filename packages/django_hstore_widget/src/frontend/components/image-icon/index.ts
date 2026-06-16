import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Pencil, Plus, X } from 'lucide-static';

export const ICON_DEFINITIONS = {
    delete: { accessibilityLabel: 'Delete Icon', svg: X },
    add: { accessibilityLabel: 'Add Icon', svg: Plus },
    edit: { accessibilityLabel: 'Edit Icon', svg: Pencil },
} as const;

export
@customElement('image-icon')
class ImageIconBase extends LitElement {
    @property({ type: String, reflect: true, attribute: 'type' })
    iconType: keyof typeof ICON_DEFINITIONS = 'delete';

    static styles = css`
        :host {
            display: inline-block;
        }

        svg {
            display: block;
            width: 16px;
            height: 16px;
        }
    `;

    protected override render() {
        const iconDefinition = ICON_DEFINITIONS[this.iconType];

        return html`<svg aria-label="${iconDefinition.accessibilityLabel}" dangerouslySetInnerHTML=${{ __html: iconDefinition.svg }}></svg>`;
    }
}
