# [Token](https://token.io) JavaScript SDK

The JavaScript SDK for interacting with [TokenOS](https://developer.token.io/).

```sh
$ npm install @token-io/tpp
```

## Usage

Ensure Node 8:

```javascript
const {TokenClient} = require('@token-io/tpp');
const Token = new TokenClient({env: 'sandbox'});
```

See [SDK docs](https://developer.token.io/sdk/?javascript#) and [API reference](https://developer.token.io/sdk/esdoc/).

There are also [samples](https://github.com/tokenio/sdk-js/tree/master/src/sample) and [sample tests](https://github.com/tokenio/sdk-js/tree/master/test/sample) in the source code for reference.
