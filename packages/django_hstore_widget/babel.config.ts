import type { BabelConfig } from '@babel/core';

const sharedPlugins = [
    '@babel/plugin-syntax-import-attributes',
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-class-properties',
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
] as const;

const config: BabelConfig = {
    presets: [['@babel/preset-env', { targets: { browsers: ['defaults'] } }], '@babel/preset-typescript'],
    plugins: sharedPlugins,
    env: {
        test: {
            presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
            plugins: sharedPlugins,
        },
    },
};

export default config;
