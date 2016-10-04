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
    "API_URL": true,
    "BROWSER": true,
    "URI_HOST": true,
    "URI_HOST_BANK": true
  },
  "rules": {
    "no-unused-vars": "warn",
    "max-nested-callbacks": "off",
    "max-len": ["warn", 100]
  },
}
