import config from '../config.json';

/**
 * Handles the auth context when using access tokens.
 */
class AuthContext {
    /**
     * Creates an AuthContext object
     */
    constructor() {
        this._onBehalfOf = undefined;
        this._keyLevel = config.KeyLevel.LOW;
        this._customerInitiated = false;
    }

    /**
     * Sets the auth context to act on behalf of another member
     *
     * @param {string} onBehalfOf - accessTokenId to use
     */
    set onBehalfOf(onBehalfOf) {
        this._onBehalfOf = onBehalfOf;
    }

    /**
    * Sets the key level to be used to sign the auth header
    *
    * @param {string} keyLevel - key Level to use
    */
    set keyLevel(keyLevel) {
        this._keyLevel = keyLevel === undefined ? config.KeyLevel.LOW : keyLevel;
    }

    /**
     * Sets the auth context to indicate that the next api call
     * would have been initiated by the customer.
     *
     * @param {boolean} flag - true if request initiated by customer
     */
    set customerInitiated(flag) {
        this._customerInitiated = flag;
    }

    /**
     * Gets the currently active memberId
     *
     * @return {string} accessTokenId being used
     */
    get onBehalfOf() {
        return this._onBehalfOf;
    }

    /**
     * Gets the key level
     *
     * @return {string} key level being used
     */
    get keyLevel() {
        return this._keyLevel;
    }

    /**
     * Gets the customer initiated request flag.
     *
     * @return {boolean} true if request initiated by customer
     */
    get customerInitiated() {
        return this._customerInitiated;
    }
}

export default AuthContext;
