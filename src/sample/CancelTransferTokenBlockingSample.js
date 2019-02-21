/**
 * Get a blocking function to cancel a transfer token.
 *
 * @param {Member} payer - payer member
 * @param {string} tokenId - id of the token to redeem
 * @return {Function} blocking function to cancel the token
 */
export default async (payer, tokenId) => {
    // Payer gets the token to see details
    const transferToken = await payer.getToken(tokenId);

    // Grantor generates the blocking function to cancel the token
    return await payer.getBlockingCancelTokenFunction(transferToken);
};
