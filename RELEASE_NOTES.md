## Release 1.4.93

### Iframe

The JS SDK now uses an iframe to the Token API server, when being called under a token domain. This removes the preflight request, and speeds up the experience.

## Release 1.4.91

### notifyPaymentRequest

There has been a change to the parameters for the method notifyPaymentRequest. The Alias parameter has been removed,
the method now receives a single parameter, the TokenPayload.
