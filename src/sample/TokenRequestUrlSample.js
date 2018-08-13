const devKey = require("../../src/config.json").devKey[TEST_ENV];
const TokenLib = require('../../src');
const Token = new TokenLib(TEST_ENV, devKey, './keys');
import Util from "../Util";
/**
 * Sample code illustrating how to generate and parse a token
 * request URL.
 */
class TokenRequestUrlSample {
    /**
     * Generate a token request authorization URL.
     *
     * @param {string} requestId - request id
     * @param {string} state - original state
     * @param {string} csrfToken - CSRF token
     * @return {string} tokenRequestUrl - the token request URL
     */
    static generateTokenRequestUrl(requestId, state, csrfToken) {
        return Token.generateTokenRequestUrl(requestId, state, csrfToken);
    }

    /**
     * Parse a token request callback URL, verify the state and signature,
     * and return the inner state and token id.
     *
     * @param {string} callbackUrl - callback URL
     * @param {string} csrfToken - CSRF token
     * @return {Object} result - inner state and token id
     */
    static async parseTokenRequestCallbackUrl(callbackUrl, csrfToken) {
        return await Token.parseTokenRequestCallbackUrl(callbackUrl, csrfToken);
    }

    /**
     * Generates a callback URL from a token request URL.
     *
     * @param {string} tokenRequestId - token request id
     * @param {object} grantor - grantor of the token
     * @param {object} grantee - grantee of the token
     * @param {string} tokenRequestUrl - token request URL
     * @return {Promise} promise - promise of callback URL
     */
    static async getCallbackUrlFromTokenRequestUrl(
        tokenRequestId,
        grantor,
        grantee,
        tokenRequestUrl) {
        const urlParams = Util.parseParamsFromUrl(tokenRequestUrl);
        const state = encodeURIComponent(urlParams.state);

        const token = await this.generateValidAccessToken(grantor, grantee);

        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);
        const callbackUrl = `http://localhost/path?tokenId=${token.id}` +
            `&state=${state}&signature=${encodeURIComponent(JSON.stringify(signature))}`;

        return callbackUrl;
    }

    /**
     * Gets the Token member.
     *
     * @return {Promise} promise - promise of the token member
     */
    static async getTokenMember() {
        return await Token._unauthenticatedClient.getTokenMember();
    }

    /**
     * Generate a valid access token for the grantor.
     * @param {Object} grantor - the token grantor
     * @param {Object} grantee - the token grantee
     * @return {Promise} promise - promise of an access token
     */
    static async generateValidAccessToken(grantor, grantee) {
        const granteeAlias = await grantee.firstAlias();
        const token = await grantor.createAccessToken(
            granteeAlias,
            [{allAccounts: {}},   // user can call getAccounts
                {allBalances: {}}]); // for each account, can getBalance

        // Grantor endorses the token, creating and submitting a digital signature
        const result = await grantor.endorseToken(token);

        return result.token;
    }
}

export default TokenRequestUrlSample;
