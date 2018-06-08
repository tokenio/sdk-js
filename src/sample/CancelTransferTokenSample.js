/**
 * Cancels a transfer token.
 *
 * @param {Member} payer - payer member
 * @param {string} tokenId - id of the token to redeem
 * @param {bool} nonBlocking - flag to create a non-blocking request
 * @return {Object} result - result of the token operation
 */
export default async (payer, tokenId, nonBlocking) => {
    // Payer gets the token to see details
    const transferToken = await payer.getToken(tokenId);

    // Payer cancels the token
    return await payer.cancelToken(transferToken, nonBlocking);
};
