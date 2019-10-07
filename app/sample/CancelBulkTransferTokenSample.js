/**
 * Cancels a bulk transfer submission token.
 *
 * @param {Member} payer - payer member
 * @param {string} tokenId - id of the token to cancel
 * @return {Object} result of the token operation
 */
export default async (payer, tokenId) => {
    // payer gets the token to see details
    const bulkTransferToken = await payer.getToken(tokenId);
    // payer cancels the token
    return await payer.cancelToken(bulkTransferToken);
};
