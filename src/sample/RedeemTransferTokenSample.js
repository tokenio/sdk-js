/**
 * Redeems a transfer token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} transfer - created transfer
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const transferToken = await payee.getToken(tokenId);

    // Destination for sending the funds
    const destination = {
        account: {
            sepa: {
                iban: '123',
            }
        }
    }

    // Payer redeems the token, getting a transfer
    const transfer = await payee.redeemToken(transferToken, 5, 'EUR', 'lunch', [destination]);

    return transfer;
}
