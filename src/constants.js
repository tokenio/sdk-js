// Signature scheme to use
const signatureScheme = 'Token-Ed25519-SHA512';

// Hosts of the gateway and fake bank
const uriHost = URI_HOST;             // populates with webpack
const uriHostBank = URI_HOST_BANK;    // ''

// Scheme for payment tokens
const paymentTokenVersion = '1.0';

// Default currency to use
const defaultCurrency = 'EUR';

// Default notification provider to use
const defaultNotificationProvider = 'Token';

export {signatureScheme, uriHost, uriHostBank, paymentTokenVersion,
   defaultCurrency, defaultNotificationProvider};
