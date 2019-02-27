/**
 * Cancels a transfer token.
 *
 * @param {Member} payer - payer member
 * @param {string} tokenId - ID of the token to redeem
 * @return {Object} result of the token operation
 */
export default async (payer, tokenId) => {
    // Payer gets the token to see details
    const transferToken = await payer.getToken(tokenId);

    // Payer cancels the token
    return await payer.cancelToken(transferToken);
};
