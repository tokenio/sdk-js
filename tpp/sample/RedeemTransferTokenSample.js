import Util from '../src/Util';

/**
 * Redeems a transfer token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - ID of the token to redeem
 * @return {Object} created transfer
 */
export default async (payee, tokenId) => {
    // We'll use this as a reference ID. Normally, a payee who
    // explicitly sets a reference ID would use an ID from a db.
    // E.g., an online merchant might use the ID of a 'shopping cart'.
    // We don't have a db, so we fake it with a random string:
    const cartId = Util.generateNonce();

    // Payee gets the token to see details
    const transferToken = await payee.getToken(tokenId);

    // Destination for sending the funds
    const destination = {
        account: {
            sepa: {
                iban: '123',
            },
        },
    };

    // Payer redeems the token, getting a transfer
    return await payee.redeemToken(
        transferToken,
        5,
        'EUR',
        'lunch',
        [destination],
        cartId);
};
