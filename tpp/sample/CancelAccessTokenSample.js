/**
 * Cancels an access token.
 *
 * @param {Member} grantee - grantee member
 * @param {string} tokenId - id of the token to cancel
 * @return {Object} result of the token operation
 */
export default async (grantee, tokenId) => {
    // Grantee gets the token to see details
    const accessToken = await grantee.getToken(tokenId);

    // Grantee cancels the token
    return await grantee.cancelToken(accessToken);
};
