import '../index';

import { beforeEach, describe, expect, test } from 'vitest';

/** Dispatch a Playwright-compatible click event on an element. */
async function click(el: Element) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await (el as HTMLElement).updateComplete;
}

/** Wait for a selector to appear in the DOM. */
async function waitFor(selector: string, root: ParentNode = document): Promise<Element | null> {
    for (let i = 0; i < 50; i++) {
        const el = root.querySelector(selector);
        if (el) return el;
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return null;
}

async function setupWidget(json = '{"hello": "world"}') {
    document.body.innerHTML = `<django-hstore-widget field_name="provider" json='${json}' />`;
    const widget = document.querySelector('django-hstore-widget')!;
    await widget.updateComplete;
    // Wait for add-button as a signal the widget fully rendered (light DOM, no shadow root).
    await waitFor('#add-button', widget);
}

beforeEach(async () => {
    await setupWidget();
});

describe('django-hstore-widget', () => {
    test('renders', async () => {
        expect(document.querySelector('#mount_error')).toBeNull();
    });

    test('json and field render', async () => {
        expect(document.querySelectorAll('#json_items').length).toBe(1);
    });

    test('error from django backend', async () => {
        await setupWidget('{');
        await waitFor('#mount_error');
        expect(document.querySelector('#mount_error')).not.toBeNull();
    });

    test('test input textbox component', async () => {
        const toggle = document.querySelector('#textarea_open_close_toggle button')!;
        expect(toggle).not.toBeNull();
        await click(toggle);

        const textbox = document.querySelector('textarea')!;
        expect(textbox).not.toBeNull();

        textbox.value = "{'my':'World\\'}";
        textbox.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 100));

        const textboxError = document.querySelector('#textbox_error')!;
        expect(textboxError).not.toBeNull();
    });

    test('test delete click', async () => {
        expect(document.querySelectorAll('#json_items').length).toBe(1);

        await click(document.querySelector('#delete-button')!);

        expect(document.querySelectorAll('#json_items').length).toBe(0);
    });

    test('test add click', async () => {
        expect(document.querySelectorAll('#json_items').length).toBe(1);

        await click(document.querySelector('#add-button')!);

        expect(document.querySelectorAll('#json_items').length).toBe(2);
    });

    test("test all buttons should have type='button'", async () => {
        const widget = document.querySelector('django-hstore-widget')!;
        const buttons = widget.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);

        buttons.forEach(button => {
            expect(button.getAttribute('type')).toEqual('button');
        });
    });
});
