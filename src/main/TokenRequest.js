export default class TokenRequest {
    /**
     * Constructs a TokenRequest.
     *
     * @param {Object} payload - token payload
     */
    constructor(payload) {
        this.payload = payload;
        this.options = {};
    }

    /**
     * Creates a TokenRequest object
     *
     * @param {Object} payload - payload of the access or transfer token
     * @return {TokenRequest} - TokenRequest object
     */
    static create(payload) {
        return new TokenRequest(payload);
    }

    /**
     * Sets an option for the TokenRequest
     *
     * @param {string} key - can be 'email' or 'bankId'
     * @param {string} value - value of the corresponding key
     * @return {TokenRequest} tokenRequest - token request
     */
    setOption(key, value) {
        this.options[key] = value;
        return this;
    }
}
