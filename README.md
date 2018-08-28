# [Token](https://token.io) JavaScript SDK

[![npm version](https://badge.fury.io/js/token-io.svg)](https://www.npmjs.com/package/token-io)

The JavaScript SDK for interacting with [TokenOS](https://developer.token.io/).

## Installation

If using npm:

```sh
npm install token-io
```

If using yarn:

```sh
yarn add token-io
```

## Usage

See [SDK docs](https://developer.token.io/sdk/?javascript#) and [API reference](https://developer.token.io/sdk/esdoc/).

There are also [samples](https://github.com/tokenio/sdk-js/tree/master/src/sample) and [sample tests](https://github.com/tokenio/sdk-js/tree/master/test/sample) in the source code for reference.

Node:

```javascript
const {TokenIO} = require('token-io');
const Token = new TokenIO({env: 'sandbox'});
```

Browser:

```javascript
import {TokenIO} from 'token-io';
const Token = new TokenIO({env: 'sandbox'});
```

#### Typing

We provide typing support for the API through [Flow](https://flow.org/en/).

If you choose to integrate Flow into your project, you can use the following command as a type checker:

```sh
yarn flow check # npm run flow check
```

## Testing

Node:

```sh
# targets dev environment by default
yarn test

# for other envs (local, dev, stg, sandbox, prd)
ENV=sandbox yarn test
```

Browser:

```sh
# targets dev environment and Chrome by default
yarn testBrowser

# for other envs (local, dev, stg, sandbox, prd) or browsers (Chrome, Firefox, Safari, IE, Edge)
ENV=sandbox yarn testBrowser --Safari
```

## Building

Make sure you have recent versions of Node and yarn.

To install dependencies:

```sh
yarn
```

To build:

```sh
yarn build # CommonJS and ES6 distributions for both Node and browser
```

This SDK uses [Babel](https://babeljs.io/docs/en/next/index.html) for transpiling and [Rollup](https://rollupjs.org/guide/en) for bundling.