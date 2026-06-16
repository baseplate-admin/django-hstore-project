import type { TransformOptions } from '@babel/core';

import litWhitespacePlugin from './babel-plugins/lit-whitespace.ts';

const config: TransformOptions = {
    presets: [
        ['@babel/preset-env', { targets: { browsers: ['defaults'] } }],
        '@babel/preset-typescript',
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { version: '2022-03' }],
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-private-methods',
        '@babel/plugin-transform-private-property-in-object',
        '@babel/plugin-transform-class-static-block',
        '@babel/plugin-syntax-import-attributes',
        litWhitespacePlugin,
    ],
    env: {
        test: {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@babel/preset-typescript',
            ],
            plugins: [
                ['@babel/plugin-proposal-decorators', { version: '2022-03' }],
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-private-methods',
                '@babel/plugin-transform-private-property-in-object',
                '@babel/plugin-transform-class-static-block',
                '@babel/plugin-syntax-import-attributes',
            ],
        },
    },
};

export default config;
