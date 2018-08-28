import {TokenPayload} from '..';
import Util from '../Util';

/**
 * Send a payment request (TokenPayload) to a potential-payer.
 *
 * @param {TokenLib} Token - initialized SDK
 * @param {Member} payee - member that hopes to receive payment
 * @param {Object} payerAlias - alias of potential-payer member
 * @return {Object} NotifyStatus - status
 */
export default async (Token, payee, payerAlias) => {
    // We'll use this as a reference ID. Normally, a payee who
    // explicitly sets a reference ID would use an ID from a db.
    // E.g., an online merchant might use the ID of a 'shopping cart'.
    // We don't have a db, so we fake it with a random string:
    const cartId = Util.generateNonce();

    const payeeAlias = await payee.firstAlias();

    // Payment request is a TokenPayload
    // protocol buffer.
    const paymentRequest = TokenPayload.create({
        description: 'Sample payment request',
        from: {
            alias: payerAlias,
        },
        to: {
            alias: payeeAlias,
        },
        transfer: {
            amount: '100',
            currency: 'EUR',
        },
        // if refID not set, the eventually-created
        // transfer token will have random refId:
        refId: cartId,
    });
    const status = await Token.notifyPaymentRequest(paymentRequest);
    return status;
};
