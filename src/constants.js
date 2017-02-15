/** Version of the SDK. */
const tokenSdkVersion = TOKEN_VERSION;

/** Signature scheme to use. */
const signatureScheme = 'Token-Ed25519-SHA512';

/** Hosts of the gateway. */
const urls = {
    local: 'http://localhost:8000',
    dev: 'https://api.dev.token.io',
    stg: 'https://api.stg.token.io',
    prd: 'https://api.token.io',
};

/** Scheme for transfer tokens. */
const transferTokenVersion = '1.0';

/** Scheme for transfer tokens. */
const accessTokenVersion = '1.0';

/** Default currency to use. */
const defaultCurrency = 'EUR';

/** Max number of decimals for amounts. */
const maxDecimals = 4;

/** Security levels for keys */
const KeyLevel = {
    PRIVILEGED: 'PRIVILEGED',
    STANDARD: 'STANDARD',
    LOW: 'LOW',
};

/** Version for localStorage schema */
const localStorageSchemaVersion = 0.1;

export {
    signatureScheme,
    urls,
    transferTokenVersion,
    accessTokenVersion,
    defaultCurrency,
    maxDecimals,
    KeyLevel,
    tokenSdkVersion,
    localStorageSchemaVersion,
};
