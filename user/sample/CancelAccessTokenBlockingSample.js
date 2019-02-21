/**
 * Get a blocking function to cancel an access token.
 *
 * @param {Member} grantor - grantor member
 * @param {string} tokenId - ID of the token to cancel
 * @return {Function} blocking function to cancel the token
 */
export default async (grantor, tokenId) => {
    // Grantor gets the token to see details
    const accessToken = await grantor.getToken(tokenId);

    // Grantor generates the blocking function to cancel the token
    return await grantor.getBlockingCancelTokenFunction(accessToken);
};
