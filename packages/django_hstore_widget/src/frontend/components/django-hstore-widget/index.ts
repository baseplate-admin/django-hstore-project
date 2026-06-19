import '$components/image-icon';

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import { cn } from '$lib/classnames';
import { DJANGO_INPUT_STYLES, DJANGO_TEXTAREA_STYLES } from '$mapppings/django';
import { GITHUB_ISSUES_URL } from '$mapppings/github';

import { StyleFactory } from '$composite_classes/style';
import { setFromAttributes } from '$store/image';

import appStyles from '$css/app.css?inline';

type JsonKeyValue = { key: string; value: string; index: number };

@customElement('django-hstore-widget')
export class DjangoHstoreWidget extends LitElement {
    override createRenderRoot() {
        return this;
    }

    @property({ type: String, attribute: 'json' })
    json = '';

    @property({ type: String, attribute: 'field_name' })
    fieldName = '';

    @property({ type: Number, attribute: 'cols' })
    cols = 40;

    @property({ type: Number, attribute: 'rows' })
    rows = 10;

    @state()
    isMounted = false;

    @state()
    parseError: string | null = null;

    @state()
    textareaValue = '';

    @state()
    keyValues: JsonKeyValue[] = [];

    @state()
    displayMode: 'rows' | 'textarea' = 'rows';

    #styleFactory = new StyleFactory();

    override connectedCallback() {
        super.connectedCallback();
        setFromAttributes(this);
    }

    override willUpdate(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('json')) {
            this.#parseJson(this.json);
        }
    }

    override firstUpdated() {
        this.#styleFactory.mountStyles(this.renderRoot, appStyles);

        if (!this.parseError) {
            this.isMounted = true;
        }
    }

    #serializeToJson({ indentSpaces }: { indentSpaces?: number } = {}) {
        const validEntries = this.keyValues.filter(entry => entry.key || entry.value).map(entry => [entry.key ?? '', entry.value ?? '']);

        const objectRepresentation = Object.fromEntries(validEntries);

        const indentWidth = indentSpaces ?? (Object.keys(objectRepresentation).length > 1 ? 4 : 0);

        return JSON.stringify(objectRepresentation, null, indentWidth);
    }

    #parseJson(jsonString: string) {
        try {
            const parsedObject = JSON.parse(jsonString);
            this.keyValues = Object.entries(parsedObject).map(([entryKey, entryValue], entryIndex) => ({
                key: entryKey,
                value: String(entryValue),
                index: entryIndex,
            }));
            this.parseError = null;
        } catch (error) {
            this.parseError = error instanceof Error ? error.toString() : 'An unknown error occurred';
        } finally {
            this.keyValues = structuredClone(this.keyValues);
        }

        this.textareaValue = this.#serializeToJson({ indentSpaces: 0 });
        this.requestUpdate();
    }

    render() {
        if (!this.isMounted) {
            return when(
                this.parseError,
                () => html`<div class="flex items-center justify-center gap-1" id="mount_error">
                    <p>Failed to mount. Unexpected JSON from <code>django backend</code></p>
                    <p>The provided json is: <code class="warning">${this.json}</code> which is not valid.</p>
                    <p>Please check the json or <a href="${GITHUB_ISSUES_URL}">file an issue at Github</a></p>
                </div>`,
            );
        }

        const handleDeleteEntry = (entryIndex: number) => {
            const foundIndex = this.keyValues.findIndex(entry => entry.index === entryIndex);
            if (foundIndex === -1) return;
            this.keyValues = this.keyValues.toSpliced(foundIndex, 1);
            this.textareaValue = this.#serializeToJson({ indentSpaces: 0 });
            this.requestUpdate();
        };

        const handleAddEntry = () => {
            const lastEntry = this.keyValues.at(-1);
            this.keyValues = [...this.keyValues, { index: (lastEntry?.index ?? -1) + 1, key: '', value: '' }];
            this.textareaValue = this.#serializeToJson({ indentSpaces: 0 });
            this.requestUpdate();
        };

        const handleToggleDisplayMode = () => {
            if (this.parseError) return;
            this.displayMode = this.displayMode === 'rows' ? 'textarea' : 'rows';
            if (this.displayMode === 'textarea') {
                this.textareaValue = this.#serializeToJson();
            }
            this.requestUpdate();
        };

        const handleTextareaInput = (event: Event) => {
            const inputJsonValue = (event.target as HTMLTextAreaElement)?.value ?? '{}';
            this.#parseJson(inputJsonValue);
            const hasNestedJsonValue = this.keyValues.some(entry => typeof entry.value === 'object');
            if (hasNestedJsonValue) {
                this.parseError = "SyntaxError: 'ltree' doesn't support nested json";
            }
            this.requestUpdate();
        };

        const handleKeyValueInput = (event: Event, entry: JsonKeyValue, inputType: 'key' | 'value') => {
            const inputValue = (event.target as HTMLInputElement)?.value;
            if (inputType === 'key') {
                entry.key = inputValue;
            } else {
                entry.value = inputValue;
            }
            this.keyValues = structuredClone(this.keyValues);
            this.textareaValue = this.#serializeToJson({ indentSpaces: 0 });
            this.requestUpdate();
        };

        const isRowsMode = this.displayMode === 'rows';
        const hasError = !!this.parseError;

        const renderKeyValueRow = (entry: JsonKeyValue) =>
            html`<div class="form-row field-data" id="json_items">
                <div class="flex gap-2.5 items-center justify-start">
                    <input
                        value="${entry.key}"
                        @input="${(event: Event) => handleKeyValueInput(event, entry, 'key')}"
                        placeholder="key"
                        class="${cn('min-width-[150px]', DJANGO_INPUT_STYLES)}"
                    />
                    <strong>:</strong>
                    <input
                        value="${entry.value}"
                        @input="${(event: Event) => handleKeyValueInput(event, entry, 'value')}"
                        placeholder="value"
                        class="${cn('min-width-[300px]', DJANGO_INPUT_STYLES)}"
                    />
                    <div
                        role="button"
                        aria-label="Delete ${entry.key}:${entry.value} at index ${entry.index}"
                        class="items-center justify-center flex cursor-pointer select-none"
                        id="delete-button"
                        @click="${() => handleDeleteEntry(entry.index)}"
                    >
                        <image-icon type="delete"></image-icon>
                    </div>
                </div>
            </div>`;

        return html`<div class="flex gap-2.5 items-center">
                <textarea
                    class="${cn(isRowsMode && 'hidden invisible', hasError && 'warning', DJANGO_TEXTAREA_STYLES)}"
                    cols="${this.cols}"
                    name=${ifDefined(this.fieldName)}
                    rows="${this.rows}"
                    @input="${handleTextareaInput}"
                    .value="${this.textareaValue}"
                ></textarea>
                <div class="${cn(hasError && 'warning brightness-90')}" id="textbox_error">${this.parseError}</div>
            </div>
            ${when(isRowsMode && !hasError && this.keyValues, () =>
                repeat(
                    this.keyValues,
                    entry => entry.index,
                    renderKeyValueRow,
                )
            )}
            <div class="form-row justify-between items-center flex">
                <button
                    type="button"
                    class="${cn(
                        isRowsMode && 'items-center select-none justify-center flex gap-1 cursor-pointer',
                        !isRowsMode && 'invisible',
                    )}"
                    id="add-button"
                    aria-label="Add Row"
                    @click="${handleAddEntry}"
                >
                    <image-icon type="add"></image-icon> Add row
                </button>
                <div class="${cn(
                    'items-center select-none justify-center flex gap-1',
                    hasError && 'opacity-60',
                    !hasError && 'cursor-pointer',
                )}" id="textarea_open_close_toggle">
                    ${when(isRowsMode,
                        () => html`<button
                            type="button"
                            class="items-center select-none justify-center flex gap-1 cursor-pointer"
                            aria-label="Open TextArea"
                            @click="${handleToggleDisplayMode}"
                        >
                            <image-icon type="edit"></image-icon> Open TextArea
                        </button>`,
                        () => html`<button
                            type="button"
                            class="items-center select-none justify-center flex gap-1 cursor-pointer"
                            aria-label="Close TextArea"
                            @click="${handleToggleDisplayMode}"
                        >
                            <image-icon type="delete"></image-icon> Close TextArea
                        </button>`,
                    )}
                </div>
            </div>`;
    }
}
