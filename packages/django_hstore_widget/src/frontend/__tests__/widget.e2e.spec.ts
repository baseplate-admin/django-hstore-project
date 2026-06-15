import { test, expect } from '@playwright/test';

test.describe('django-hstore-widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('django-hstore-widget');
        // Wait for Lit to finish first update (light DOM - no shadowRoot)
        await page.waitForFunction(() => {
            const el = document.querySelector('django-hstore-widget');
            return el?.querySelector('#add-button') !== null;
        });
    });

    test('renders', async ({ page }) => {
        await expect(page.locator('#mount_error')).toHaveCount(0);
    });

    test('json and field render', async ({ page }) => {
        const rows = page.locator('django-hstore-widget').locator('#json_items');
        await expect(rows).toHaveCount(1);
    });

    test('error from django backend', async ({ page }) => {
        await page.setContent(
            `<!DOCTYPE html><html><body><django-hstore-widget field_name="provider" json='{'></django-hstore-widget><script type="module" src="/index.ts"></script></body></html>`,
            { waitUntil: 'domcontentloaded' },
        );
        await page.waitForSelector('#mount_error');
        await expect(page.locator('#mount_error')).toBeVisible();
    });

    test('test input textbox component', async ({ page }) => {
        const toggle = page.locator('#textarea_open_close_toggle button');
        await expect(toggle).toBeVisible();
        await toggle.click();

        const textbox = page.locator('textarea');
        await expect(textbox).toBeVisible();

        await textbox.fill("{'my':'World\\'}");

        const textboxError = page.locator('#textbox_error');
        await expect(textboxError).toBeVisible();
    });

    test('test delete click', async ({ page }) => {
        const rows = page.locator('django-hstore-widget').locator('#json_items');
        await expect(rows).toHaveCount(1);

        await page.locator('#delete-button').click({ force: true });
        await expect(rows).toHaveCount(0);
    });

    test('test add click', async ({ page }) => {
        const rows = page.locator('django-hstore-widget').locator('#json_items');
        await expect(rows).toHaveCount(1);

        await page.locator('#add-button').click();
        await expect(rows).toHaveCount(2);
    });

    test("test all buttons should have type='button'", async ({ page }) => {
        const buttons = page.locator('django-hstore-widget').locator('button');
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const type = await buttons.nth(i).getAttribute('type');
            expect(type).toEqual('button');
        }
    });
});
