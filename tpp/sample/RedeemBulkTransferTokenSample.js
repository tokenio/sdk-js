/**
 * Redeems a bulk transfer token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - ID of the token to redeem
 * @return {Object} created bulk transfer submission
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const bulkTransferToken = await payee.getToken(tokenId);
    // Payer redeems the token, getting a bulk transfer
    return await payee.redeemBulkTransferToken(bulkTransferToken.id);
};
