## Release 1.4.123

Don't clear entire localstorage, as there may be other important information stored there.

## Release 1.4.122

Add ManualCryptoEngine which allows the client to pass in the private keys that she wants to use.

## Release 1.4.109

MemoryCryptoEngine and BrowserCryptoEngine functions are now async.
(Before, UnsecuredFileCryptoEngine was async but the others weren't.
Now, all are async.)

## Release 1.4.105

The "login" method was renamed to "getMember".

## Release 1.4.98

Added developer key verification to api calls. The following classes now require a developerKey when instantiated:
* Token
* Member
* HttpClient
* AuthHttpClient

## Release 1.4.96

### Member.aliases

Member.aliases' return type changed from an
array of strings (like
["address@example.com"]) to an array of
alias structures (like
[ { type: "EMAIL", value: "address@example.com" } ] ).

## Release 1.4.95

### Member.firstAlias

Member.firstAlias' return type changed from a string (like
"address@example.com") to alias structure (like
{ type: "EMAIL", value: "address@example.com" } ).

### Iframe

The JS SDK now uses an iframe to the Token API server, when being called
under a token domain. This removes the preflight request, and speeds up
the experience.

## Release 1.4.91

### notifyPaymentRequest

There has been a change to the parameters for the method notifyPaymentRequest.
The Alias parameter has been removed, the method now receives a single
parameter, the TokenPayload.
