/**
 * Redeems an information access token token, in order to acquire names of the grantor's
 * accounts.
 *
 * @param {Member} grantee - grantee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Array} accounts - grantor accounts
 */
export default async (grantee, tokenId) => {
    // Use the access token, now making API calls on behalf of the grantor, and get accounts
    grantee.useAccessToken(tokenId);
    const accounts = await grantee.getAccounts();

    // Clear the access token
    grantee.clearAccessToken();
    return accounts;
}
