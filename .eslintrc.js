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
        'arrow-parens': 'off',
        'indent': ['error', 4],
        'max-len': ['warn', 150],
        'prefer-const': ['error'],
        'no-unused-vars': ['warn'],
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'eol-last': ['error', 'always'],
        'no-trailing-spaces': ['error'],
        'no-whitespace-before-property': ['error'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-multiple-empty-lines': ['error', {
            max: 1,
            maxEOF: 0,
            maxBOF: 0,
        }],
        'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    },
};
