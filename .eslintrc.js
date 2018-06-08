module.exports = {
    "extends": "google",
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true,
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "globals": {
        "define": true,
        "BROWSER": true,
        "TEST_ENV": true,
        "TOKEN_VERSION": true,
    },
    "rules": {
        "no-unused-vars": "warn",
        "max-nested-callbacks": "off",
        "max-len": ["warn", 150],
        "indent": "off",
        "arrow-parens": "off",
        "comma-dangle": "off",
    },
};
