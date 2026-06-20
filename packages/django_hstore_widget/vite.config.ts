import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

const frontendSourceDir = resolve(__dirname, 'src', 'frontend');

export default defineConfig({
    root: frontendSourceDir,
    base: '/',
    resolve: {
        tsconfigPaths: true,
    },
    css: {
        transformer: 'lightningcss',
    },
    build: {
        outDir: path.resolve(__dirname, 'dist', 'components'),
        emptyOutDir: true,
        lib: {
            entry: resolve(frontendSourceDir, 'index.ts'),
            formats: ['iife'],
            name: 'DjangoHstoreWidget',
            fileName: () => 'django-hstore-widget.js',
        },
    },
});
