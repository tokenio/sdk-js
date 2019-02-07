import {TokenIO, Resource} from '..';
import Util from '../Util';

const devKey = require('../../src/config.json').devKey[TEST_ENV];
const Token = new TokenIO({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Sample code illustrating how to generate and parse a token
 * request URL.
 */
class TokenRequestUrlSample {
    /**
     * Generate a token request authorization URL.
     *
     * @param {string} requestId - request id
     * @return {string} the token request URL
     */
    static generateTokenRequestUrl(requestId) {
        return Token.generateTokenRequestUrl(requestId);
    }

    /**
     * Parse a token request callback URL, verify the state and signature,
     * and return the inner state and token id.
     *
     * @param {string} callbackUrl - callback URL
     * @param {string} csrfToken - CSRF token
     * @return {Object} inner state and token id
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
     * @return {Promise} promise of callback URL
     */
    static async getCallbackUrlFromTokenRequestUrl(
        tokenRequestId,
        grantor,
        grantee,
        tokenRequestUrl) {

        // assume empty state, retrieved from the token request
        const state = encodeURIComponent(JSON.stringify({innerState: '', csrfTokenHash: Util.hashString('')}));
        const token = await this.generateValidAccessToken(grantor, grantee);
        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);
        const callbackUrl = `http://localhost/path?tokenId=${token.id}` +
            `&state=${state}&signature=${encodeURIComponent(JSON.stringify(signature))}`;

        return callbackUrl;
    }

    /**
     * Gets the Token member.
     *
     * @return {Promise} promise of the token member
     */
    static async getTokenMember() {
        return await Token._unauthenticatedClient.getTokenMember();
    }

    /**
     * Generate a valid access token for the grantor.
     * @param {Object} grantor - the token grantor
     * @param {Object} grantee - the token grantee
     * @return {Promise} promise of an access token
     */
    static async generateValidAccessToken(grantor, grantee) {
        const granteeAlias = await grantee.firstAlias();
        const token = await grantor.createAccessToken(
            granteeAlias,
            [
                Resource.create({allAccounts: {}}), // user can call getAccounts
                Resource.create({allBalances: {}}), // for each account, can getBalance
            ]
        );

        // Grantor endorses the token, creating and submitting a digital signature
        const result = await grantor.endorseToken(token);

        return result.token;
    }
}

export default TokenRequestUrlSample;
