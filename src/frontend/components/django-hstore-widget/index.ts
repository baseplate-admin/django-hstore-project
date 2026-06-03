import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setState } from '$store/image';
import '../image-icon';
import { cn } from '$lib/classnames';
import widgetCss from './widget.css?inline';

const DJ = { input: 'vTextField', textarea: 'vLargeTextField' } as const;
const GH = 'https://github.com/baseplate-admin/django-hstore-widget/issues';

@customElement('django-hstore-widget')
class DjangoHstoreWidget extends LitElement {
    // Light DOM
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
    @state() _items: { key: string; value: string; index: number }[] = [];
    @state() _mode: 'rows' | 'textarea' = 'rows';

    #cssInjected = false;

    override connectedCallback() {
        super.connectedCallback();
        if (!this.#cssInjected) {
            this.#cssInjected = true;
            const s = document.createElement('style');
            s.textContent = widgetCss;
            this.appendChild(s);
        }
        for (const k of ['deleteSvgSrc', 'addSvgSrc', 'editSvgSrc'] as const) {
            const v = this[k];
            if (v) setState({ [k.replace(/[A-Z]/g, '_$1').toLowerCase()]: v });
        }
    }

    override willUpdate(changed: Map<string, unknown>) {
        if (changed.has('json')) this._parse(this.json);
    }

    override firstUpdated() {
        if (!this._err) this._mounted = true;
    }

    _str({ indent: i }: { indent?: number } = {}) {
        const o: Record<string, string> = {};
        for (const it of this._items) if (it.key || it.value) o[it.key ?? ''] = it.value ?? '';
        return JSON.stringify(o, null, i ?? (Object.keys(o).length > 1 ? 4 : 0));
    }

    _parse(s: string) {
        try {
            const o = JSON.parse(s);
            this._items = Object.keys(o).map((k, i) => ({ key: k, value: o[k], index: i }));
            this._err = null;
        } catch (e) {
            this._err = e instanceof Error ? e.toString() : 'An unknown error occurred';
        } finally {
            this._items = structuredClone(this._items);
        }
        this._tv = this._str({ indent: 0 });
        this.requestUpdate();
    }

    render() {
        if (!this._mounted) {
            if (this._err)
                return html`<div class="flex items-center justify-center gap-1" id="mount_error">
                    <p>Failed to mount. Unexpected JSON from <code>django backend</code></p>
                    <p>The provided json is: <code class="warning">${this.json}</code> which is not valid.</p>
                    <p>Please check the json or <a href="${GH}">file an issue at Github</a></p>
                </div>`;
            return html``;
        }

        const del = (i: number) => {
            this._items = this._items.filter(x => x.index !== i);
            this._tv = this._str({ indent: 0 });
            this.requestUpdate();
        };
        const add = () => {
            const l = this._items.at(-1);
            this._items.push({ index: l ? l.index + 1 : 0, key: '', value: '' });
            this._items = structuredClone(this._items);
            this._tv = this._str({ indent: 0 });
            this.requestUpdate();
        };
        const tog = () => {
            if (this._err) return;
            this._mode = this._mode === 'rows' ? 'textarea' : 'rows';
            if (this._mode === 'textarea') this._tv = this._str();
            this.requestUpdate();
        };
        const txtIn = (e: Event) => {
            this._parse((e.currentTarget as HTMLTextAreaElement)?.value || '{}');
            for (const it of this._items) if (typeof it.value === 'object') this._err = "SyntaxError: 'ltree' doesn't support nested json";
            this.requestUpdate();
        };
        const dicIn = (e: Event, it: (typeof this._items)[0], t: 'key' | 'value') => {
            const v = (e.currentTarget as HTMLInputElement)?.value;
            if (t === 'key') it.key = v;
            else it.value = v;
            this._items = structuredClone(this._items);
            this._tv = this._str({ indent: 0 });
            this.requestUpdate();
        };

        const row = (it: (typeof this._items)[0]) =>
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
