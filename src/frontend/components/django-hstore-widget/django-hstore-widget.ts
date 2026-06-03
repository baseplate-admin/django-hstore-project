import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { setState } from '$store/image';

const DJ = Object.freeze({ input: 'vTextField', textarea: 'vLargeTextField' });
const GH = 'https://github.com/baseplate-admin/django-hstore-widget/issues';

@customElement('django-hstore-widget')
class DjangoHstoreWidget extends LitElement {
    static override styles = css`
        button {
            all: unset;
        }
        .w150 {
            min-width: 150px;
        }
        .w300 {
            min-width: 300px;
        }
        .flex {
            display: flex;
        }
        .hidden {
            display: none;
        }
        .nos {
            user-select: none;
        }
        .jcc {
            justify-content: center;
        }
        .jcs {
            justify-content: flex-start;
        }
        .jcb {
            justify-content: space-between;
        }
        .aic {
            align-items: center;
        }
        .inv {
            visibility: hidden;
        }
        .g1 {
            gap: 0.25rem;
        }
        .g3 {
            gap: 0.625rem;
        }
        .op6 {
            opacity: 0.6;
        }
        .cp {
            cursor: pointer;
        }
        .br9 {
            filter: brightness(0.9);
        }
        .warn {
            color: var(--error-fg, red);
            border-color: var(--error-fg, red);
        }
    `;

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
    @state() _mode: 'rows' | 'txt' = 'rows';

    override connectedCallback() {
        super.connectedCallback();
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
            this._err = e instanceof Error ? e.toString() : 'Error';
        } finally {
            this._items = structuredClone(this._items);
        }
        this._tv = this._str({ indent: 0 });
        this.requestUpdate();
    }

    render() {
        if (!this._mounted) {
            if (this._err)
                return html`<div class="flex aic jcc g1" id="mount_error">
                    <p>Failed to mount. Unexpected JSON from <code>django backend</code></p>
                    <p>The provided json is: <code class="warn">${this.json}</code> which is not valid.</p>
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
            this._mode = this._mode === 'rows' ? 'txt' : 'rows';
            if (this._mode === 'txt') this._tv = this._str();
            this.requestUpdate();
        };
        const txtIn = (e: Event) => {
            this._parse((e.target as HTMLTextAreaElement).value || '{}');
            for (const it of this._items) if (typeof it.value === 'object') this._err = "SyntaxError: 'ltree' doesn't support nested json";
            this.requestUpdate();
        };
        const dicIn = (e: Event, it: (typeof this._items)[0], t: 'key' | 'value') => {
            const v = (e.target as HTMLInputElement).value;
            if (t === 'key') it.key = v;
            else it.value = v;
            this._items = structuredClone(this._items);
            this._tv = this._str({ indent: 0 });
            this.requestUpdate();
        };

        const row = (it: (typeof this._items)[0]) =>
            html`<div class="form-row field-data" id="json_items">
                <div class="flex g3 aic jcs">
                    <input value="${it.key}" @input="${(e: Event) => dicIn(e, it, 'key')}" placeholder="key" class="w150 ${DJ.input}" />
                    <strong>:</strong>
                    <input value="${it.value}" @input="${(e: Event) => dicIn(e, it, 'value')}" placeholder="value" class="w300 ${DJ.input}" />
                    <div
                        role="button"
                        aria-label="Delete ${it.key}:${it.value} at index ${it.index}"
                        class="aic jcc flex cp nos"
                        id="delete-button"
                        @click="${() => del(it.index)}"
                    >
                        <image-icon type="delete"></image-icon>
                    </div>
                </div>
            </div>`;

        return html`<div class="flex g3 aic">
                <textarea
                    class="${this._mode === 'rows' ? 'hidden inv' : ''} ${this._err ? 'warn' : ''} ${DJ.textarea}"
                    cols="${this.cols}"
                    name="${this.fieldName}"
                    rows="${this.rows}"
                    @input="${txtIn}"
                    .value="${this._tv}"
                ></textarea>
                <div class="${this._err ? 'warn br9' : 'inv'}" id="textbox_error">${this._err}</div>
            </div>
            ${this._mode === 'rows' && !this._err && this._items ? this._items.map(row) : ''}
            <div class="form-row jcb aic flex">
                <button type="button" class="${this._mode === 'rows' ? 'aic nos jcc flex g1 cp' : 'inv'}" id="add-button" aria-label="Add Row" @click="${add}">
                    <image-icon type="add"></image-icon> Add row
                </button>
                <div class="${this._err ? 'op6' : 'cp'} aic nos jcc flex g1" id="textarea_open_close_toggle">
                    ${this._mode === 'txt'
                        ? html`<button type="button" class="aic nos jcc flex g1 cp" aria-label="Close TextArea" @click="${tog}">
                              <image-icon type="delete"></image-icon> Close TextArea
                          </button>`
                        : html`<button type="button" class="aic nos jcc flex g1 cp" aria-label="Open TextArea" @click="${tog}">
                              <image-icon type="edit"></image-icon> Open TextArea
                          </button>`}
                </div>
            </div>`;
    }
}

export { DjangoHstoreWidget };
