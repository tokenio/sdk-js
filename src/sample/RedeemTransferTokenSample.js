import {TransferEndpoint} from '..';
import Util from '../Util';

/**
 * Redeems a transfer token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} transfer - created transfer
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
    const destination = TransferEndpoint.create({
        account: {
            sepa: {
                iban: '123',
            },
        },
    });

    // Payer redeems the token, getting a transfer
    const transfer = await payee.redeemToken(
        transferToken,
        5,
        'EUR',
        'lunch',
        [destination],
        cartId);

    return transfer;
};
