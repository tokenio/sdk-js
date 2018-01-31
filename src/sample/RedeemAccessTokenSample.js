import config from "../config.json";

/**
 * Sample code illustrating how a grantee might use an access token.
 */
class RedeemAccessTokenSample {
    /**
     * Redeems an information access token token to fetch an account balance.
     * Assumes the token grants "allAccounts" access.
     *
     * @param {Member} grantee - grantee member
     * @param {string} tokenId - id of the token to redeem
     * @return {Object} balance0 - balance of one account
     */
    static async use(grantee, tokenId) {
        // Use the access token, now making API calls
        // on behalf of the grantor, and get accounts
        grantee.useAccessToken(tokenId);
        const accounts = await grantee.getAccounts();

        // Get informtion we want:
        const balance0 = await grantee.getBalance(accounts[0].id, config.KeyLevel.STANDARD);

        // When done using access, clear the access token:
        grantee.clearAccessToken();
        return balance0.balance.current;
    }

    /**
     * Redeems an information access token token to fetch an account balance.
     * Does not assume the token grants "allAccounts" access.
     *
     * @param {Member} grantee - grantee member
     * @param {string} tokenId - id of the token to redeem
     * @return {Object} balance of one account (or {} if no access to any accounts)
     */
    static async carefullyUse(grantee, tokenId) {
        var accessToken = await grantee.getToken(tokenId);
        while (accessToken.replacedByTokenId) {
            accessToken = await grantee.getToken(accessToken.replacedByTokenId);
        }
        var accountIds = {};
        var haveAllBalancesAccess = false;
        var haveAllAccountsAccess = false;
        var i;
        for (i = 0; i < accessToken.payload.access.resources.length; i++) {
            const resource = accessToken.payload.access.resources[i];
            if (resource.balance && resource.balance.accountId) {
                accountIds[resource.balance.accountId] = true;
                continue;
            }
            if (resource.allBalances) {
                haveAllBalancesAccess = true;
                continue;
            }
            if (resource.allAccounts) {
                haveAllAccountsAccess = true;
                continue;
            }
        }
        grantee.useAccessToken(accessToken.id);
        if (haveAllBalancesAccess && haveAllAccountsAccess) {
            const accounts = await grantee.getAccounts();
            for (i = 0; i < accounts.length; i++) {
                accountIds[accounts[i].id] = true;
            }
        }
        if (Object.keys(accountIds).length < 1) {
            // don't have access to any account, return empty
            return {};
        }
        for (i = 0; i < Object.keys(accountIds).length; i++) {
            try {
                const accountId = Object.keys(accountIds)[i];
                const balanceResponse = await grantee.getBalance(accountId, config.KeyLevel.STANDARD);
                grantee.clearAccessToken();
                return balanceResponse.balance.current;
            } catch (ex) {
                // If grantor previously un-linked an account, then grantee can't get its balance.
                if (ex.response && ex.response.data && ex.response.data.startsWith &&
                    ex.response.data.startsWith("FAILED_PRECONDITION")) {
                    continue;
                }
            }
        }
        // don't have access to any account, return empty
        return {};
    }
}
export default RedeemAccessTokenSample;
