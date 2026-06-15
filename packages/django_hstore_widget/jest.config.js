/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(t|j)sx?$': 'babel-jest',
    },
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/__mocks__/style.mock.js',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lit|@lit)/)'],
};

export default config;
