module.exports = {
    extends: [
        '@token-io',
        'plugin:flowtype/recommended',
    ],
    env: {
        mocha: true,
    },
    globals: {
        BROWSER: true,
        TEST_ENV: true,
        TOKEN_VERSION: true,
    },
    plugins: [
        'flowtype',
    ],
    rules: {
        'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    },
};
