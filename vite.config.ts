import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src/frontend',
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        outDir: resolve(__dirname, 'dist/components'),
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/frontend/index.ts'),
            formats: ['es'],
            fileName: () => 'django-hstore-widget.js',
        },
        rollupOptions: {
            output: {
                codeSplitting: false,
            },
        },
        cssCodeSplit: false,
        sourcemap: false,
        target: 'esnext',
    },
});
