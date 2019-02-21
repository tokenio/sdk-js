/**
 * Cancels an access token.
 *
 * @param {Member} grantor - grantor member
 * @param {string} tokenId - id of the token to cancel
 * @return {Object} result of the token operation
 */
export default async (grantor, tokenId) => {
    // Grantor gets the token to see details
    const accessToken = await grantor.getToken(tokenId);

    // Grantor cancels the token
    return await grantor.cancelToken(accessToken);
};
