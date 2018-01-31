import config from "../config.json";

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
     * Gets the currently active memberId
     *
     * @return {string} onBehalfOf - accessTokenId being used
     */
    get onBehalfOf() {
        return this._onBehalfOf;
    }

    /**
     * Gets the key level and resets it to low
     *
     * @return {string} keyLevel - key level being used
     */
    get keyLevel() {
        const level = this._keyLevel;
        this._keyLevel = config.KeyLevel.LOW;
        return level;
    }
}

export default AuthContext;
