export default class TokenRequest {
    /**
     * Constructs a TokenRequest.
     *
     * @param {Object} payload - token payload
     * @param {Object} options - options
     * @return {TokenRequest} TokenRequest
     */
    constructor(payload, options) {
        return {
            payload,
            options,
        };
    }

    /**
     * Creates a TokenRequest object, with the correct options set.
     *
     * @param {Object} payload - payload of the access or transfer token
     * @param {string} alias - alias of the payer
     * @param {string} bankId - bankId of the payer
     * @param {string} redirectUrl - redirectUrl for OAuth
     * @return {TokenRequest} - TokenRequest object
     */
    static create(payload, alias, bankId, redirectUrl) {
        const options = {};

        if (alias) {
            options.ALIAS = alias;
        }
        if (bankId) {
            options.BANK_ID = bankId;
        }
        if (redirectUrl) {
            options.REDIRECT_URL = redirectUrl;
        }
        return new TokenRequest(payload, options);
    }
}
