import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'src/frontend/__tests__',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    webServer: {
        command: 'npm run dev',
        port: 9100,
        timeout: 60_000,
        reuseExistingServer: !process.env.CI,
    },
    use: {
        baseURL: 'http://localhost:9100',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
});
