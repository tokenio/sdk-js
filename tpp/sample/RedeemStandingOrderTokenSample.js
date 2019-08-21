/**
 * Redeems a standing order submission token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - ID of the token to redeem
 * @return {Object} created standing order submission
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const standingOrderToken = await payee.getToken(tokenId);
    // Payer redeems the token, getting a standing order submission
    return await payee.redeemStandingOrderToken(standingOrderToken.id);
};
