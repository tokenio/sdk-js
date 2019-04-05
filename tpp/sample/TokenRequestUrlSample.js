import {TokenClient} from '../src';

const devKey = require('../src/config.json').devKey[TEST_ENV];
const Token = new TokenClient({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Sample code illustrating how to generate and parse a token
 * request URL.
 */
class TokenRequestUrlSample {
    /**
     * Parse a token request callback URL, verify the state and signature,
     * and return the inner state and token ID.
     *
     * @param {string} callbackUrl - callback URL
     * @param {string} csrfToken - CSRF token
     * @return {Object} inner state and token ID
     */
    static async parseTokenRequestCallbackUrl(callbackUrl, csrfToken) {
        return await Token.parseTokenRequestCallbackUrl(callbackUrl, csrfToken);
    }

    /**
     * Generates a callback URL from a token request URL.
     *
     * @param {string} tokenRequestId - token request ID
     * @param {object} grantor - grantor of the token
     * @param {object} grantee - grantee of the token
     * @param {object} token - valid token
     * @return {Promise} promise of callback URL
     */
    static async getCallbackUrlFromTokenRequestUrl(
        tokenRequestId,
        grantor,
        grantee,
        token) {

        // assume empty state, retrieved from the token request
        const state = encodeURIComponent(JSON.stringify({innerState: 'state'}));
        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);
        return `http://localhost/path?tokenId=${token.id}` +
            `&state=${encodeURIComponent(state)}&signature=${encodeURIComponent(JSON.stringify(signature))}`;
    }

    /**
     * Gets the Token member.
     *
     * @return {Promise} promise of the token member
     */
    static async getTokenMember() {
        return await Token._unauthenticatedClient.getTokenMember();
    }
}

export default TokenRequestUrlSample;
