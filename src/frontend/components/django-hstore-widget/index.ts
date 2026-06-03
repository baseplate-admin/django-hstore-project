import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { state } from 'lit/decorators/state.js';
import { setState } from '$store/image';
import '../image-icon';
import { cn } from '$lib/classnames';
import widgetCss from './widget.css?inline';

const DJ = Object.freeze({ input: 'vTextField' as const, textarea: 'vLargeTextField' as const });
const GH = 'https://github.com/baseplate-admin/django-hstore-widget/issues';
const SVG_KEYS = Object.freeze(['deleteSvgSrc', 'addSvgSrc', 'editSvgSrc'] as const);
let _cssDone = false;

type Item = { key: string; value: string; index: number };

@customElement('django-hstore-widget')
class DjangoHstoreWidget extends LitElement {
    override createRenderRoot() {
        return this;
    }

    @property({ type: String }) json = '';
    @property({ type: String, attribute: 'field_name' }) fieldName = '';
    @property({ type: Number }) cols = 40;
    @property({ type: Number }) rows = 10;
    @property({ type: String, attribute: 'delete_svg_src' }) deleteSvgSrc?: string;
    @property({ type: String, attribute: 'add_svg_src' }) addSvgSrc?: string;
    @property({ type: String, attribute: 'edit_svg_src' }) editSvgSrc?: string;

    @state() _mounted = false;
    @state() _err: string | null = null;
    @state() _tv = '';
    @state() _items: Item[] = [];
    @state() _mode: 'rows' | 'textarea' = 'rows';

    override connectedCallback() {
        super.connectedCallback();
        _cssDone ||= (this.appendChild(Object.assign(document.createElement('style'), { textContent: widgetCss })), true);
        SVG_KEYS.forEach(k => this[k] && setState({ [k.replace(/[A-Z]/g, '_$1').toLowerCase()]: this[k]! }));
    }

    override willUpdate(changed: Map<string, unknown>) {
        changed.has('json') && this.#parse(this.json);
    }

    override firstUpdated() {
        !this._err && (this._mounted = true);
    }

    #str({ indent: i }: { indent?: number } = {}) {
        const o = Object.fromEntries(this._items.filter(it => it.key || it.value).map(it => [it.key ?? '', it.value ?? '']));
        return JSON.stringify(o, null, i ?? (Object.keys(o).length > 1 ? 4 : 0));
    }

    #parse(s: string) {
        try {
            const o = JSON.parse(s);
            this._items = Object.entries(o).map(([k, v], i) => ({ key: k, value: String(v), index: i }));
            this._err = null;
        } catch (e) {
            this._err = e instanceof Error ? e.toString() : 'An unknown error occurred';
        } finally {
            this._items = structuredClone(this._items);
        }
        this._tv = this.#str({ indent: 0 });
        this.requestUpdate();
    }

    render() {
        if (!this._mounted) {
            return this._err
                ? html`<div class="flex items-center justify-center gap-1" id="mount_error">
                      <p>Failed to mount. Unexpected JSON from <code>django backend</code></p>
                      <p>The provided json is: <code class="warning">${this.json}</code> which is not valid.</p>
                      <p>Please check the json or <a href="${GH}">file an issue at Github</a></p>
                  </div>`
                : html``;
        }

        const del = (i: number) => {
            const idx = this._items.findIndex(x => x.index === i);
            if (idx === -1) return;
            this._items = this._items.toSpliced(idx, 1);
            this._tv = this.#str({ indent: 0 });
            this.requestUpdate();
        };

        const add = () => {
            const last = this._items.at(-1);
            this._items = [...this._items, { index: (last?.index ?? -1) + 1, key: '', value: '' }];
            this._tv = this.#str({ indent: 0 });
            this.requestUpdate();
        };

        const tog = () => {
            if (this._err) return;
            this._mode = this._mode === 'rows' ? 'textarea' : 'rows';
            this._mode === 'textarea' && (this._tv = this.#str());
            this.requestUpdate();
        };

        const txtIn = (e: Event) => {
            this.#parse((e.target as HTMLTextAreaElement)?.value ?? '{}');
            this._items.some(it => typeof it.value === 'object') && (this._err = "SyntaxError: 'ltree' doesn't support nested json");
            this.requestUpdate();
        };

        const dicIn = (e: Event, it: Item, t: 'key' | 'value') => {
            const v = (e.target as HTMLInputElement)?.value;
            t === 'key' ? (it.key = v) : (it.value = v);
            this._items = structuredClone(this._items);
            this._tv = this.#str({ indent: 0 });
            this.requestUpdate();
        };

        const row = (it: Item) =>
            html`<div class="form-row field-data" id="json_items">
                <div class="flex gap-2.5 items-center justify-start">
                    <input value="${it.key}" @input="${(e: Event) => dicIn(e, it, 'key')}" placeholder="key" class="min-width-[150px] ${DJ.input}" />
                    <strong>:</strong>
                    <input value="${it.value}" @input="${(e: Event) => dicIn(e, it, 'value')}" placeholder="value" class="min-width-[300px] ${DJ.input}" />
                    <div
                        role="button"
                        aria-label="Delete ${it.key}:${it.value} at index ${it.index}"
                        class="items-center justify-center flex cursor-pointer select-none"
                        id="delete-button"
                        @click="${() => del(it.index)}"
                    >
                        <image-icon type="delete"></image-icon>
                    </div>
                </div>
            </div>`;

        return html`<div class="flex gap-2.5 items-center">
                <textarea
                    class="${cn(this._mode === 'rows' && 'hidden invisible')} ${cn(this._err && 'warning')} ${DJ.textarea}"
                    cols="${this.cols}"
                    name="${this.fieldName}"
                    rows="${this.rows}"
                    @input="${txtIn}"
                    .value="${this._tv}"
                ></textarea>
                <div class="${cn(this._err && 'warning brightness-90')}" id="textbox_error">${this._err}</div>
            </div>
            ${this._mode === 'rows' && !this._err && this._items ? this._items.map(row) : ''}
            <div class="form-row justify-between items-center flex">
                <button
                    type="button"
                    class="${this._mode === 'rows' ? 'items-center select-none justify-center flex gap-1 cursor-pointer' : 'invisible'}"
                    id="add-button"
                    aria-label="Add Row"
                    @click="${add}"
                >
                    <image-icon type="add"></image-icon> Add row
                </button>
                <div class="${cn(this._err && 'opacity-60') || 'cursor-pointer'} items-center select-none justify-center flex gap-1" id="textarea_open_close_toggle">
                    ${this._mode === 'textarea'
                        ? html`<button type="button" class="items-center select-none justify-center flex gap-1 cursor-pointer" aria-label="Close TextArea" @click="${tog}">
                              <image-icon type="delete"></image-icon> Close TextArea
                          </button>`
                        : html`<button type="button" class="items-center select-none justify-center flex gap-1 cursor-pointer" aria-label="Open TextArea" @click="${tog}">
                              <image-icon type="edit"></image-icon> Open TextArea
                          </button>`}
                </div>
            </div>`;
    }
}

export { DjangoHstoreWidget };
