# Token JavaScript SDK

A javascript SDK for interacting with TokenOS.

* Token company information: https://token.io
* TokenOS developer documentation: https://developer.token.io
* SDK documentation: https://developer.token.io/sdk/
* Reference documentation: https://developer.token.io/sdk/esdoc/

API is in `src/main`; sample code is in `src/samples`.

## Using the SDK
### Installation

Token requires a recent version of npm/yarn to build.

Install the npm package:

```sh
$ npm install token-io
```

### Importing
To use in a browser:

```sh
$ var TokenLib = require("token-io");
$ var Token = TokenLib(env = "sandbox");
```

To use in node:

```sh
$ var TokenLib = require("token-io/dist/token-io.node.js")
$ var Token = new TokenLib("sandbox");
```

## Developing/Changing the SDK

If you're changing the SDK itself (instead of using the SDK to develop client code). First, you
must have recent versions of node.js, npm, and yarn installed. Clone this repository, and then
run the following commands:

Install dependencies / initialize the code.
```sh
$ yarn
```

To build:
```sh
$ yarn run build
```
To test in node:
```sh
$ yarn run testNodeSandbox
```

To test in the browser:
```sh
$ yarn run testBrowserSandbox
```

To update the version
```sh
$ npm version patch
```

Make sure to update the version before pushing a change. Then push to a separate branch and make
a PR to master. Once master branch is updated, automated tests will run, and if successful, the
new SDK is published automatically to NPM.

Also, make sure to add a test for any non-trivial change.

Additional commands can be found in package.json.

### Tools

This sdk is using webpack and babel. This means that whenever you make a change to source code
or run a test, the code will get transpiled from ES6 into regular javascript that can run
in the browser or in node. It has a few dependencies, mainly for cryptographic operations 
and ajax requests. Async / Await is also used heavily, which allows making sync-like async requests
instead of using promise .then repeatedly, which makes using and developing with the SDK much 
easier.

The linter is run when the tests are executed (if using yarn). 

### IDE support (Webstorm) and Testing

Webstorm IDE allows fast development as well as an easy way to run tests. It also suports linting
with ESLint. (WebStorm > Preferences > Languages and Frameworks > Javascript > Code Quality Tools > Eslint).

* First, make sure you have the latest version of Webstorm installed. 
* Then, open the sdk-js-tests directory from Webstorm.
* Follow the set up for your preferred testing suite: Mocha or Karma

Note: You cannot use both Karma and Mocha at the same time. However, you can set up the two and switch between the two by changing the Plugin Preferences.

#### Set the default settings for Mocha:
This is useful to run tests very easily using the IDE, for fast iteration and testing.
This will run the tests using node.js. Mocha allows you run individual tests within the same test suite.

* Make sure Karma Plugin is disabled: Webstorm > Preferences > Plugins
* Click Run > Edit configurations.
* Select Defaults > Mocha
* Environment variables: TEST_ENV = sandbox
* Mocha package: ....../sdk-js-tests/node_modules/mocha-webpack
* User interface: bdd
* Extra mocha options: --webpack-config config/webpack.config.node.js --timeout 60000 --watch --colors
* All in directory:  Test directory: ....../sdk-js-tests/test
* Now click apply, and click the plus sign on the top left. Create a new Mocha config that derives
from the default one.
* Save and exit the menu, now run the new Mocha config that you just created, which will 
run all the tests
* Now right click on any test or test file, and click Run, to run it in mocha. 
This will compile the test using webpack, and run it against the servers. 
To change to another environment (dev) just change the test env.
* You can also run it in debug mode by right clicking the test or file and clickig debug. In 
order to do this, you must remove the timeout from the Extra Mocha Options, and you must 
write the word 'debugger;' on the line which you wish the debugger to stop.
* To add linting on every test run, go to the Run Configuration, and under the "Before Launch"
section, add an NPM script, and under scripts, put "lint".

#### Set the default settings for Karma:
This is useful for testing changes which may only apply to browsers.

* First go to WebStorm > Preferences > Plugins, and make sure Karma is enabled
* Click Run > Edit configurations.
* Select Defaults > Karma
* Configuration file: ....../sdk-js-tests/test/karma.config.js
* Karma package: ......./sdk-js-tests/node_modules/karma 
* Environment variables: TEST_ENV = sandbox
* After this, you can create different custom Karma configs which are based off of this one. For 
example, you can create a BrowserDev config, which has a TEST_ENV = dev, and will run all the
tests in stg. Then when you want to test your changes in the browser, against the dev environment,
you select your run configuration in the top right, and click Run (the green play arrow).
* You can also right click on files or test functions and run the tests based on Karma
* To add linting on every test run, go to the Run Configuration, and under the "Before Launch"
section, add an NPM script, and under scripts, put "lint".

