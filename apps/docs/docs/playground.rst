Playground
==========

Interactive demo of the ``django-hstore-widget`` component.
Edit key-value pairs, add new entries, and delete existing ones.

.. raw:: html

   <script type="module" src="../_static/admin/js/django_hstore_widget/django-hstore-widget.js"></script>

   <style>
       /* Django admin field styles — vTextField, vLargeTextField, form-row */
       :root {
           --body-fg: #333;
           --body-bg: #fff;
           --body-quiet-color: #666;
           --body-medium-color: #444;
           --border-color: #ccc;
           --hairline-color: #e8e8e8;
           --error-fg: #ba2121;
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
       }

       django-hstore-widget input,
       django-hstore-widget textarea,
       django-hstore-widget select {
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
       }

       django-hstore-widget .vTextField {
           width: 20em;
           min-width: 100%;
       }

       django-hstore-widget .vLargeTextField {
           width: 48em;
       }

       django-hstore-widget .form-row {
           overflow: hidden;
           padding: 10px;
           font-size: 0.8125rem;
           border-bottom: 1px solid var(--hairline-color);
       }

       .admin-playground {
           background: var(--body-bg, #fff);
           border: 1px solid var(--hairline-color, #e8e8e8);
           border-radius: 4px;
           padding: 0;
           margin: 16px 0;
           color: var(--body-fg, #333);
       }
       .admin-playground fieldset {
           border: 1px solid var(--hairline-color, #e8e8e8);
           border-radius: 4px;
           padding: 12px;
           margin: 0;
       }
       .admin-playground legend {
           font-weight: bold;
           color: var(--body-quiet-color, #666);
           font-size: 0.8125rem;
           padding: 4px 10px 0 0;
           display: block;
           min-width: 160px;
       }
       .admin-playground django-hstore-widget {
           min-height: 200px;
       }
       .admin-playground django-hstore-widget .warning {
           color: var(--error-fg, #ba2121);
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
