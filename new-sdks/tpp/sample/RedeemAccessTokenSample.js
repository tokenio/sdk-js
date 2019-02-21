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
        // on behalf of the grantor, and get accounts
        // forAccessToken snippet begin
        const grantor = grantee.forAccessToken(tokenId);
        let accounts;
        try {
            accounts = await grantor.getAccounts();
        } catch (e) {
            // no access (e.g. grantor unlinked accounts or revoked access)
            return {};
        }

        // Get information we want:
        const balance0 = await grantor.getBalance(accounts[0].id(), config.KeyLevel.LOW);
        // forAccessToken snippet end

        return balance0.current;
    }
}
export default RedeemAccessTokenSample;
