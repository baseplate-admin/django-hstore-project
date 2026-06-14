import { cn } from '$lib/classnames';
import { setState } from '$store/image';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { state } from 'lit/decorators/state.js';
import widgetCss from './widget.css';

import { DJANGO_MAPPING } from '$mappping/django';
import { GITHUB_REPO } from '$mappping/github';
import { SVG_KEYS } from '$mappping/svg_keys';

import { ImageIconComponent } from '$components/image-icon';
import { enterScope, exitScope } from '$registry/scope';

type KeyValueItem = { key: string; value: string; index: number };

let widgetInstanceCount = 0;

@customElement('django-hstore-widget')
class DjangoHstoreWidget extends LitElement {
    @property({ type: String }) json = '';
    @property({ type: String, attribute: 'field_name' }) fieldName = '';
    @property({ type: Number }) cols = 40;
    @property({ type: Number }) rows = 10;
    @property({ type: String, attribute: 'delete_svg_src' }) deleteSvgSrc?: string;
    @property({ type: String, attribute: 'add_svg_src' }) addSvgSrc?: string;
    @property({ type: String, attribute: 'edit_svg_src' }) editSvgSrc?: string;

    @state() isMounted = false;
    @state() parsingError: string | null = null;
    @state() rawTextAreaContent = '';
    @state() keyValueRows: KeyValueItem[] = [];
    @state() displayMode: 'rows' | 'textarea' = 'rows';

    #cssRegistered = false;

    protected override createRenderRoot() {
        return this;
    }

    override connectedCallback(): void {
        super.connectedCallback();
        widgetInstanceCount++;

        // Register the image-icon element when the first widget mounts
        if (widgetInstanceCount === 1) {
            customElements.define('image-icon', ImageIconComponent);
        }

        // Activate the scope so child components know they're inside this widget
        enterScope('django-hstore-widget');

        if (!this.#cssRegistered) {
            const styleElement = document.createElement('style');
            styleElement.textContent = widgetCss;
            this.appendChild(styleElement);
            this.#cssRegistered = true;
        }

        for (const svgKey of SVG_KEYS) {
            const svgValue = this[svgKey];
            if (svgValue) {
                const normalisedKey = svgKey.replace(/[A-Z]/g, '_$1').toLowerCase();
                setState({ [normalisedKey]: svgValue });
            }
        }
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        widgetInstanceCount--;

        // Deactivate the scope and unregister image-icon when all widgets disconnect
        if (widgetInstanceCount <= 0) {
            widgetInstanceCount = 0;
            exitScope('django-hstore-widget');
            customElements.unlink('image-icon');
        }
    }

    override willUpdate(changedProperties: Map<string, unknown>): void {
        if (changedProperties.has('json')) {
            this.#parseJsonInput(this.json);
        }
    }

    override firstUpdated(): void {
        if (!this.parsingError) {
            this.isMounted = true;
        }
    }

    #buildJsonString({ indentCount }: { indentCount?: number } = {}): string {
        const filteredEntries = this.keyValueRows
            .filter(entry => entry.key || entry.value)
            .map(entry => [entry.key ?? '', entry.value ?? '']);

        const reconstructedObject = Object.fromEntries(filteredEntries);
        const usePrettyPrinting = Object.keys(reconstructedObject).length > 1;
        const indentation = indentCount ?? (usePrettyPrinting ? 4 : 0);

        return JSON.stringify(reconstructedObject, null, indentation);
    }

    #parseJsonInput(jsonString: string): void {
        try {
            const parsedObject = JSON.parse(jsonString);
            this.keyValueRows = Object.entries(parsedObject).map(([entryKey, entryValue], entryIndex) => ({
                key: entryKey,
                value: String(entryValue),
                index: entryIndex,
            }));
            this.parsingError = null;
        } catch (error) {
            this.parsingError = error instanceof Error ? error.toString() : 'An unknown error occurred';
        } finally {
            this.keyValueRows = structuredClone(this.keyValueRows);
        }

        this.rawTextAreaContent = this.#buildJsonString({ indentCount: 0 });
        this.requestUpdate();
    }

    protected override render() {
        if (!this.isMounted) {
            return this.parsingError
                ? html`<div class="flex items-center justify-center gap-1" id="mount_error">
                      <p>Failed to mount. Unexpected JSON from <code>django backend</code></p>
                      <p>The provided json is: <code class="warning">${this.json}</code> which is not valid.</p>
                      <p>Please check the json or <a href="${GITHUB_REPO}">file an issue at Github</a></p>
                  </div>`
                : html``;
        }

        const removeRow = (rowIndex: number) => {
            const foundIndex = this.keyValueRows.findIndex(row => row.index === rowIndex);
            if (foundIndex === -1) return;

            this.keyValueRows = this.keyValueRows.toSpliced(foundIndex, 1);
            this.rawTextAreaContent = this.#buildJsonString({ indentCount: 0 });
            this.requestUpdate();
        };

        const addNewRow = () => {
            const lastRow = this.keyValueRows.at(-1);
            const nextIndex = (lastRow?.index ?? -1) + 1;
            this.keyValueRows = [...this.keyValueRows, { index: nextIndex, key: '', value: '' }];
            this.rawTextAreaContent = this.#buildJsonString({ indentCount: 0 });
            this.requestUpdate();
        };

        const toggleDisplayMode = () => {
            if (this.parsingError) return;

            this.displayMode = this.displayMode === 'rows' ? 'textarea' : 'rows';

            if (this.displayMode === 'textarea') {
                this.rawTextAreaContent = this.#buildJsonString();
            }

            this.requestUpdate();
        };

        const handleTextAreaInput = (event: Event) => {
            const textAreaElement = event.target as HTMLTextAreaElement;
            const textContent = textAreaElement?.value ?? '{}';
            this.#parseJsonInput(textContent);

            const containsNestedObjects = this.keyValueRows.some(entry => typeof entry.value === 'object');
            if (containsNestedObjects) {
                this.parsingError = "SyntaxError: 'ltree' doesn't support nested json";
            }

            this.requestUpdate();
        };

        const handleCellInput = (event: Event, rowItem: KeyValueItem, targetField: 'key' | 'value') => {
            const inputElement = event.target as HTMLInputElement;
            const inputValue = inputElement?.value;

            if (targetField === 'key') {
                rowItem.key = inputValue;
            } else {
                rowItem.value = inputValue;
            }

            this.keyValueRows = structuredClone(this.keyValueRows);
            this.rawTextAreaContent = this.#buildJsonString({ indentCount: 0 });
            this.requestUpdate();
        };

        const renderRow = (rowItem: KeyValueItem) =>
            html`<div class="form-row field-data" id="json_items">
                <div class="flex gap-2.5 items-center justify-start">
                    <input
                        value="${rowItem.key}"
                        @input="${(event: Event) => handleCellInput(event, rowItem, 'key')}"
                        placeholder="key"
                        class="min-width-[150px] ${DJANGO_MAPPING.input}"
                    />
                    <strong>:</strong>
                    <input
                        value="${rowItem.value}"
                        @input="${(event: Event) => handleCellInput(event, rowItem, 'value')}"
                        placeholder="value"
                        class="min-width-[300px] ${DJANGO_MAPPING.input}"
                    />
                    <div
                        role="button"
                        aria-label="Delete ${rowItem.key}:${rowItem.value} at index ${rowItem.index}"
                        class="items-center justify-center flex cursor-pointer select-none"
                        id="delete-button"
                        @click="${() => removeRow(rowItem.index)}"
                    >
                        <image-icon type="delete"></image-icon>
                    </div>
                </div>
            </div>`;

        return html`<div class="flex gap-2.5 items-center">
                <textarea
                    class="${cn(this.displayMode === 'rows' && 'hidden invisible')} ${cn(this.parsingError && 'warning')} ${DJANGO_MAPPING.textarea}"
                    cols="${this.cols}"
                    name="${this.fieldName}"
                    rows="${this.rows}"
                    @input="${handleTextAreaInput}"
                    .value="${this.rawTextAreaContent}"
                ></textarea>
                <div class="${cn(this.parsingError && 'warning brightness-90')}" id="textbox_error">${this.parsingError}</div>
            </div>
            ${this.displayMode === 'rows' && !this.parsingError && this.keyValueRows ? this.keyValueRows.map(renderRow) : ''}
            <div class="form-row justify-between items-center flex">
                <button
                    type="button"
                    class="${this.displayMode === 'rows' ? 'items-center select-none justify-center flex gap-1 cursor-pointer' : 'invisible'}"
                    id="add-button"
                    aria-label="Add Row"
                    @click="${addNewRow}"
                >
                    <image-icon type="add"></image-icon> Add row
                </button>
                <div class="${cn(this.parsingError && 'opacity-60') || 'cursor-pointer'} items-center select-none justify-center flex gap-1" id="textarea_open_close_toggle">
                    ${this.displayMode === 'textarea'
                        ? html`<button
                              type="button"
                              class="items-center select-none justify-center flex gap-1 cursor-pointer"
                              aria-label="Close TextArea"
                              @click="${toggleDisplayMode}"
                          >
                              <image-icon type="delete"></image-icon> Close TextArea
                          </button>`
                        : html`<button
                              type="button"
                              class="items-center select-none justify-center flex gap-1 cursor-pointer"
                              aria-label="Open TextArea"
                              @click="${toggleDisplayMode}"
                          >
                              <image-icon type="edit"></image-icon> Open TextArea
                          </button>`}
                </div>
            </div>`;
    }
}

export { DjangoHstoreWidget };
