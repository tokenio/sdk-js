/**
 * Redeems an information access token token, in order to acquire names of the grantor's
 * accounts.
 *
 * @param {Member} grantee - grantee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} balance0 - balance of one account
 */
export default async (grantee, tokenId) => {
    // Use the access token, now making API calls
    // on behalf of the grantor, and get accounts
    grantee.useAccessToken(tokenId);
    const accounts = await grantee.getAccounts();

    // Get informtion we want:
    const balance0 = await grantee.getBalance(accounts[0].id);

    // When done using access, clear the access token:
    grantee.clearAccessToken();
    return balance0.current;
};
