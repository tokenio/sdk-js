// Signature scheme to use
const signatureScheme = 'Token-Ed25519-SHA512';

// Hosts of the gateway and fake bank
// const uriHost = 'http://dev.api.token.io';
// const uriHostBank = 'http://dev.api.token.io:81';
const uriHost = 'http://localhost:8000';
const uriHostBank = 'http://localhost:8100';

// Scheme for payment tokens
const paymentTokenScheme = 'Pay/1.0';

// Default currency to use
const defaultCurrency = 'EUR';

// Default notification provider to use
const defaultNotificationProvider = 'Token';

export {signatureScheme, uriHost, uriHostBank, paymentTokenScheme,
   defaultCurrency, defaultNotificationProvider};
