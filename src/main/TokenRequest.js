import {TokenPayload} from '../proto';

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
        return new TokenRequest(TokenPayload.create(payload));
    }

    /**
     * Sets a default email for the TokenRequest
     *
     * @param {string} email - default email
     * @return {TokenRequest} tokenRequest - token request
     */
    setEmail(email) {
        this.options.email = email;
        return this;
    }

    /**
     * Sets a default bank ID for the TokenRequest
     *
     * @param {string} bankId - bank ID
     * @return {TokenRequest} tokenRequest - token request
     */
    setBankId(bankId) {
        this.options.bankId = bankId;
        return this;
    }

    /**
     * Sets a redirect URL for the TokenRequest
     *
     * @param {string} redirectUrl - redirect URL
     * @return {TokenRequest} tokenRequest - token request
     */
    setRedirectUrl(redirectUrl) {
        this.options.redirectUrl = redirectUrl;
        return this;
    }

    /**
     * Sets a user ref ID for the TokenRequest
     *
     * @param {string} userRefId - user ref id
     * @return {TokenRequest} tokenRequest - token request
     */
    setUserRefId(userRefId) {
        this.userRefId = userRefId;
        return this;
    }
}
