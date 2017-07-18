/**
 * Handles the auth context when using access tokens.
 */
class AuthContext {
    /**
     * Creates an AuthContext object
     */
    constructor() {
        this._onBehalfOf = undefined;
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
     * Gets the currently active memberId
     *
     * @return {string} onBehalfOf - accessTokenId being used
     */
    get onBehalfOf() {
        return this._onBehalfOf;
    }
}

export default AuthContext;
