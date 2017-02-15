# Token-io SDK  (Readme may not up to date, view source)

A javascript SDK for interacting with the Token System. Visit Token at http://token.io.

### Installation

Token requires a recent version of npm to build.

Install the npm package:

```sh
$ npm install token-io
```

To use in a browser:

```sh
$ var tokenIo = require("token-io");
$ var Token = tokenIo(env = "prd");
```


Works in a node as well, but have to directly require the node file from token-io/dist.
Minified files available in dist as well.

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
