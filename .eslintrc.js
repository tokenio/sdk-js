module.exports = {
    "extends": "google",
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true,
    },

    "globals": {
        "define": true,
        "BROWSER": true,
        "TEST_ENV": true,
    },
    "rules": {
        "no-unused-vars": "warn",
        "max-nested-callbacks": "off",
        "max-len": ["warn", 100],
        "indent": "off"
    },
};
