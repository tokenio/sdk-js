# Token-io SDK  (Readme may not up to date, view source)

A javascript SDK for interacting with the Token System. Visit Token at http://token.io.

### Installation

Token requires a recent version of npm/yarn to build.

Install the npm package:

```sh
$ npm install token-io
```

To use in a browser:

```sh
$ var tokenLib = require("token-io");
$ var Token = tokenLib(env = "prd");
```

To use in node:

```sh
$ var TokenLib = require("token-io/dist/token-io.node.min.js")
$ var Token = new TokenLib("prd");
```

To build:
```sh
$ yarn run build
```

To test in the browser:
```sh
$ yarn run testBrowserStg
```

To test in node:
```sh
$ yarn run testNodeStg
```

To update the version
```sh
$ npm version patch
```

Make sure to update the version before pushing a change
