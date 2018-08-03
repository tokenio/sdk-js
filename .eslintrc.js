module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:flowtype/recommended',
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
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
        'no-var': ['error'],
        'prefer-const': ['error'],
        'max-len': ['warn', 150],
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'always-multiline'],
        'arrow-parens': 'off',
        'eol-last': ['error', 'always'],
        'semi': ['error', 'always'],
        'no-trailing-spaces': ['error'],
        'no-unused-vars': ['warn'],
        'max-nested-callbacks': 'off',
    },
};
