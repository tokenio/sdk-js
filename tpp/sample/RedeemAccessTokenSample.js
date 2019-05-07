import config from '../src/config.json';

/**
 * Sample code illustrating how a grantee might use an access token.
 */
class RedeemAccessTokenSample {
    /**
     * Redeems an information access token token to fetch an account balance.
     * Assumes the token grants 'allAccounts' access.
     *
     * @param {Member} grantee - grantee member
     * @param {string} tokenId - ID of the token to redeem
     * @return {Object} balance of one account
     */
    static async use(grantee, tokenId) {
        // Use the access token, now making API calls
        // on behalf of the grantor (as a representative), and get accounts
        // forAccessToken snippet begin
        const representative = grantee.forAccessToken(tokenId);
        const accounts = await representative.getAccounts();
        if (!accounts) return;

        // Get information we want:
        const balance0 = await representative.getBalance(accounts[0].id(), config.KeyLevel.LOW);
        // forAccessToken snippet end

        return balance0.current;
    }
}
export default RedeemAccessTokenSample;
