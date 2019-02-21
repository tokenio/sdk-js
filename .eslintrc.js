module.exports = {
    extends: [
        '@token-io',
        'plugin:flowtype/recommended',
    ],
    env: {
        mocha: true,
    },
    globals: {
        TEST_ENV: true,
        TOKEN_VERSION: true,
    },
    plugins: [
        'flowtype',
    ],
    rules: {
        'flowtype/delimiter-dangle': ['error', 'always-multiline'],
        'flowtype/require-return-type': ['error', 'always', {excludeArrowFunctions: true}],
        'flowtype/object-type-delimiter': ['error', 'comma'],
        'flowtype/semi': ['error', 'always'],
    },
    settings: {
        flowtype: {
            onlyFilesWithFlowAnnotation: true,
        },
    },
};
