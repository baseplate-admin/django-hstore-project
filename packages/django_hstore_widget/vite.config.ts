import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

const frontendSourceDir = resolve(__dirname, 'src', 'frontend');

export default defineConfig({
    root: frontendSourceDir,
    base: '/',
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
    server: {
        host: 'localhost',
        port: 9100,
    },
});
