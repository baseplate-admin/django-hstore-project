Playground
==========

Interactive demo of the ``django-hstore-widget`` component.
Edit key-value pairs, add new entries, and delete existing ones.

.. raw:: html

   <script type="module" src="../_static/admin/js/django_hstore_widget/django-hstore-widget.js"></script>

   <style>
       .playground-widget {
           background: var(--sy-c-background, #f8f9fa);
           border: 1px solid var(--sy-c-border, #dee2e6);
           border-radius: 8px;
           padding: 24px;
           margin: 16px 0;
           color: var(--sy-c-text, #374151);
       }
       .playground-widget django-hstore-widget {
           min-height: 200px;
       }
       .playground-widget django-hstore-widget input,
       .playground-widget django-hstore-widget textarea {
           background: var(--sy-c-surface, #ffffff);
           color: var(--sy-c-text, #374151);
           border-color: var(--sy-c-border, #dee2e6);
       }
       .playground-widget django-hstore-widget .warning {
           color: var(--sy-c-bold, #dc2626);
       }
   </style>

   <div class="playground-widget">
       <django-hstore-widget
           style="width: 100%"
           delete_svg_src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23e74c3c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='15' y1='9' x2='9' y2='15'%3E%3C/line%3E%3Cline x1='9' y1='9' x2='15' y2='15'%3E%3C/line%3E%3C/svg%3E"
           add_svg_src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2327ae60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='16'%3E%3C/line%3E%3Cline x1='8' y1='12' x2='16' y2='12'%3E%3C/line%3E%3C/svg%3E"
           edit_svg_src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233498db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'%3E%3C/path%3E%3Cpath d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'%3E%3C/path%3E%3C/svg%3E"
           field_name="playground_metadata"
           json='{"color": "blue", "size": "large", "status": "active"}'
       ></django-hstore-widget>
   </div>

.. note::

   The widget above is the live ``django-hstore-widget`` Lit component built
   at docs build time.  Try adding, editing, and deleting key-value pairs.
