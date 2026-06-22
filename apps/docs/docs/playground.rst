Playground
==========

Interactive demo of the ``django-hstore-widget`` component.
Edit key-value pairs, add new entries, and delete existing ones.

.. raw:: html

   <script type="module" src="../_static/admin/js/django_hstore_widget/django-hstore-widget.js"></script>

   <style>
       /* Django admin base.css + forms.css (Django 5.1+) — full cascade for playground */
       :root {
           --primary: #79aec8;
           --secondary: #417690;
           --accent: #f5dd5d;
           --primary-fg: #fff;
           --body-fg: #333;
           --body-bg: #fff;
           --body-quiet-color: #666;
           --body-medium-color: #444;
           --body-loud-color: #000;
           --header-color: #ffc;
           --header-branding-color: var(--accent);
           --header-bg: var(--secondary);
           --header-link-color: var(--primary-fg);
           --link-fg: #417893;
           --link-hover-color: #036;
           --hairline-color: #e8e8e8;
           --border-color: #ccc;
           --error-fg: #ba2121;
           --darkened-bg: #f8f8f8;
           --selected-bg: #e4e4e4;
           --button-fg: #fff;
           --button-bg: var(--secondary);
           --button-hover-bg: #205067;
           --delete-button-bg: #ba2121;
           --delete-button-hover-bg: #a41515;
           --close-button-bg: #747474;
           --close-button-hover-bg: #333;
           --font-family-primary:
               "Segoe UI",
               system-ui,
               Roboto,
               "Helvetica Neue",
               Arial,
               sans-serif,
               "Apple Color Emoji",
               "Segoe UI Emoji",
               "Segoe UI Symbol",
               "Noto Color Emoji";
           --font-family-monospace:
               ui-monospace,
               Menlo,
               Monaco,
               "Cascadia Mono",
               "Segoe UI Mono",
               "Roboto Mono",
               "Oxygen Mono",
               "Ubuntu Monospace",
               "Source Code Pro",
               "Fira Mono",
               "Droid Sans Mono",
               "Courier New",
               monospace,
               "Apple Color Emoji",
               "Segoe UI Emoji",
               "Segoe UI Symbol",
               "Noto Color Emoji";
       }

       /* ── Playground container (Django admin fieldset.module) ── */
       .admin-playground {
           background: var(--body-bg);
           border: 1px solid var(--hairline-color);
           border-radius: 4px;
           padding: 0;
           margin: 16px 0;
           color: var(--body-fg);
           overflow: hidden;
       }

       .admin-playground fieldset {
           border: none;
           border-radius: 0;
           padding: 0;
           margin: 0;
           min-width: 0;
       }

       .admin-playground legend {
           font-weight: 400;
           font-size: 0.8125rem;
           background: var(--header-bg);
           color: var(--header-link-color);
           padding: 8px;
           border: 1px solid var(--header-bg);
           margin: 0;
           display: block;
           min-width: 160px;
       }

       .admin-playground django-hstore-widget {
           display: block;
           width: 100%;
           max-width: 100%;
           min-width: 0;
       }

       /* ── Widget root (shadow host) ── */
       django-hstore-widget {
           font-family: var(--font-family-primary);
           font-size: 0.8125rem;
           color: var(--body-fg);
       }

       /* ── FORM DEFAULTS (base.css) ── */
       django-hstore-widget input,
       django-hstore-widget textarea,
       django-hstore-widget select,
       django-hstore-widget .form-row p {
           margin: 2px 0;
           padding: 2px 3px;
           vertical-align: middle;
           font-family: var(--font-family-primary);
           font-weight: normal;
           font-size: 0.8125rem;
       }

       django-hstore-widget textarea {
           vertical-align: top;
       }

       /* ── Input styling (base.css) ── */
       django-hstore-widget input:not([type]),
       django-hstore-widget input[type=text],
       django-hstore-widget input[type=password],
       django-hstore-widget input[type=email],
       django-hstore-widget input[type=url],
       django-hstore-widget input[type=number],
       django-hstore-widget input[type=tel],
       django-hstore-widget textarea,
       django-hstore-widget select,
       django-hstore-widget .vTextField {
           border: 1px solid var(--border-color);
           border-radius: 4px;
           padding: 5px 6px;
           margin-top: 0;
           color: var(--body-fg);
           background-color: var(--body-bg);
       }

       django-hstore-widget input:not([type]):focus,
       django-hstore-widget input[type=text]:focus,
       django-hstore-widget input[type=password]:focus,
       django-hstore-widget input[type=email]:focus,
       django-hstore-widget input[type=url]:focus,
       django-hstore-widget input[type=number]:focus,
       django-hstore-widget input[type=tel]:focus,
       django-hstore-widget textarea:focus,
       django-hstore-widget select:focus,
       django-hstore-widget .vTextField:focus {
           border-color: var(--body-quiet-color);
           outline: none;
       }

       django-hstore-widget select {
           height: 1.875rem;
       }

       django-hstore-widget select[multiple] {
           height: auto;
           min-height: 150px;
       }

       /* ── FORM ROWS (forms.css) ── */
       django-hstore-widget .form-row {
           overflow: hidden;
           padding: 10px;
           font-size: 0.8125rem;
           border-bottom: 1px solid var(--hairline-color);
       }

       django-hstore-widget .form-row img,
       django-hstore-widget .form-row input {
           vertical-align: middle;
       }

       /* ── Colon between key and value (strong:) ── */
       django-hstore-widget .form-row strong {
           font-weight: normal;
           color: var(--body-fg);
           padding: 0 6px;
           white-space: nowrap;
           line-height: 1;
       }

       /* ── Custom element host ── */
       django-hstore-widget > :first-child {
           display: contents;
       }

       /* ── KEY / VALUE INPUT WIDTHS (forms.css) ── */
       django-hstore-widget .vTextField {
           width: 20em;
           box-sizing: border-box;
       }

       django-hstore-widget .vLargeTextField {
           width: 48em;
           box-sizing: border-box;
       }

       /* ── ADD-ROW BUTTON (base.css .button) ── */
       django-hstore-widget #add-button {
           background: var(--button-bg);
           padding: 10px 15px;
           border: none;
           border-radius: 4px;
           color: var(--button-fg);
           cursor: pointer;
           font-family: var(--font-family-primary);
           font-size: 0.8125rem;
           line-height: 1;
           transition: background 0.15s;
           white-space: nowrap;
           display: inline-flex;
           align-items: center;
           justify-content: center;
           gap: 4px;
       }

       django-hstore-widget #add-button:hover {
           background: var(--button-hover-bg);
       }

       django-hstore-widget #add-button:active {
           background: var(--button-hover-bg);
       }

       /* ── INLINE-DELETE LINK ── */
       django-hstore-widget .inline-deletelink {
           opacity: 0.6;
           filter: grayscale(1);
           cursor: pointer;
           border: none;
           background: none;
           padding: 0;
           display: inline-flex;
           align-items: center;
       }

       django-hstore-widget .inline-deletelink:hover {
           opacity: 1;
           filter: grayscale(0);
       }

       /* ── ICON IMAGES ── */
       django-hstore-widget .w-4.h-4 {
           width: 1rem;
           height: 1rem;
           display: inline-block;
           vertical-align: middle;
       }

       /* ── TEXTAREA (edit mode) ── */
       django-hstore-widget textarea {
           width: 100%;
           min-height: 80px;
           resize: vertical;
           box-sizing: border-box;
       }

       /* ── WARNING TEXT ── */
       django-hstore-widget .warning {
           color: var(--error-fg);
           font-size: 0.75rem;
           padding: 4px 0;
       }

       /* ── FLEX UTILITIES (widget-internal) ── */
       django-hstore-widget .flex {
           display: flex;
       }

       django-hstore-widget .items-center {
           align-items: center;
       }

       django-hstore-widget .justify-between {
           justify-content: space-between;
       }

       django-hstore-widget .gap-1 {
           gap: 0.25rem;
       }

       django-hstore-widget .select-none {
           user-select: none;
       }

       django-hstore-widget .cursor-pointer {
           cursor: pointer;
       }

       django-hstore-widget .invisible {
           visibility: hidden;
       }

       django-hstore-widget .whitespace-nowrap {
           white-space: nowrap;
       }

       /* ── LUCIDE FALLBACK ICONS ── */
       django-hstore-widget icon {
           display: inline-block;
           width: 1rem;
           height: 1rem;
           vertical-align: middle;
       }

       django-hstore-widget icon svg {
           width: 100%;
           height: 100%;
       }

       /* ── Docs code blocks (Django admin styling) ── */
       div.highlight,
       div.highlight-python,
       div.highlight-bash,
       div.highlight-sql,
       div.highlight-text,
       div.highlight-default,
       div.highlight-django,
       div.highlight-console {
           border: 1px solid #ccc;
           border-radius: 4px;
           background-color: #f8f8f8;
           padding: 6px 8px;
           margin: 0 0 1.4em;
           font-family: "Fira Mono", Consolas, Menlo, Monaco, "Courier New", Courier, monospace;
           font-size: 0.8125rem;
           line-height: 1.4;
           color: #333;
       }

       div.highlight > pre {
           background: none;
           border: none;
           padding: 0;
           margin: 0;
       }

       div.highlight pre code {
           background: none;
           border: none;
           padding: 0;
           margin: 0;
       }

       code.literal,
       code.xref {
           font-family: "Fira Mono", Consolas, Menlo, Monaco, "Courier New", Courier, monospace;
           font-size: 0.8125rem;
           background-color: #f8f8f8;
           border: 1px solid #e8e8e8;
           border-radius: 3px;
           padding: 1px 4px;
       }
   </style>

   <div class="admin-playground">
       <fieldset>
           <legend>Metadata</legend>
           <django-hstore-widget
               style="width: 100%"
               field_name="playground_metadata"
               json='{"color": "blue", "size": "large", "status": "active"}'
           ></django-hstore-widget>
       </fieldset>
   </div>

.. note::
   The widget above is the live ``django-hstore-widget`` Lit component built
   at docs build time.  Try adding, editing, and deleting key-value pairs.
