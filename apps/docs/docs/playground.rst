Playground
==========

Interactive demo of the ``django-hstore-widget`` component.
Edit key-value pairs, add new entries, and delete existing ones.

.. raw:: html

   <script type="module" src="../_static/admin/js/django_hstore_widget/django-hstore-widget.js"></script>

   <style>
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
