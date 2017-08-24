/**
 * Send a payment request (TokenPayload) to a potential-payer.
 *
 * @param {TokenLib} Token - initialized SDK
 * @param {Member} payee - member that hopes to receive payment
 * @param {Object} payerAlias - alias of potential-payer member
 * @return {Object} NotifyStatus - status
 */
export default async (Token, payee, payerAlias) => {
    const payeeAlias = {
        type: 'USERNAME',
        value: await payee.firstAlias()
    };

    // Payment request is a TokenPayload
    // protocol buffer.
    const paymentRequest = {
        description: 'Sample payment request',
        from: {
            alias: payerAlias
        },
        to: {
            alias: payeeAlias
        },
        transfer: {
            amount: '100',
            currency: 'EUR'
        }
    };
    const status = await Token.notifyPaymentRequest(
        payerAlias,
        paymentRequest);
    return status;
};
