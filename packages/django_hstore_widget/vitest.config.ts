import path, { resolve } from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const frontendSourceDir = resolve(__dirname, 'src', 'frontend');

export default defineConfig({
    root: frontendSourceDir,
    resolve: {
        alias: {
            $lib: path.resolve(frontendSourceDir, 'lib'),
            $store: path.resolve(frontendSourceDir, 'stores'),
            $mappping: path.resolve(frontendSourceDir, 'mappings'),
            $mapppings: path.resolve(frontendSourceDir, 'mappings'),
            $components: path.resolve(frontendSourceDir, 'components'),
            $composite_classes: path.resolve(frontendSourceDir, 'composite_classes'),
            $css: path.resolve(frontendSourceDir, 'css'),
        },
    },
    css: {
        transformer: 'lightningcss',
    },
    test: {
        browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'firefox' }],
        },
        include: ['__tests__/**/*.spec.ts'],
    },
});
