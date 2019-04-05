# [Token](https://token.io) JavaScript SDK

The JavaScript SDK for interacting with [TokenOS](https://developer.token.io/).

```sh
$ npm install @token-io/tpp
```

## Usage

Ensure Node 8:

```js
const {TokenClient} = require('@token-io/tpp');
const Token = new TokenClient({env: 'sandbox'});
```

See API reference for [TPP SDK](https://developer.token.io/sdk/esdoc-tpp/) and [Core SDK](https://developer.token.io/sdk/esdoc-core/).

There are also [samples](https://github.com/tokenio/sdk-js/tree/master/tpp/sample) and [sample tests](https://github.com/tokenio/sdk-js/tree/master/tpp/test/sample) in the source code for reference.
