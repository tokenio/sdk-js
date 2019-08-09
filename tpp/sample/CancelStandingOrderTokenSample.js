/**
 * Cancels a standing order submission token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to cancel
 * @return {Object} result of the token operation
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const standingOrderToken = await payee.getToken(tokenId);
    // Payee cancels the token
    return await payee.cancelToken(standingOrderToken);
};
