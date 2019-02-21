/**
 * Cancels a transfer token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} result of the token operation
 */
export default async (payee, tokenId) => {
    // Payer gets the token to see details
    const transferToken = await payee.getToken(tokenId);

    // Payer cancels the token
    return await payee.cancelToken(transferToken);
};
