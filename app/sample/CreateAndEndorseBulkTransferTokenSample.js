import Util from '../src/Util';

/**
 * Creates a bulk transfer token and endorses it to a payee.
 *
 * @param {Member} payer - member that will fund the token
 * @param {Object} payeeAlias - alias of the payee member
 * @return {Object} endorsed token
 */
export default async (payer, payeeAlias) => {
    // We'll use this as a reference ID. Normally, a payer who
    // explicitly sets a reference ID would use an ID from a db.
    // E.g., a bill-paying service might use ID of a 'purchase'.
    // We don't have a db, so we fake it with a random string:
    const purchaseId = Util.generateNonce();

    const accountId = (await payer.getAccounts())[0].id();

    const transfers = [
        {
            amount: '20',
            currency: 'USD',
            refId: '1234a',
            description: 'order1',
            destination: {
                sepa: {
                    iban: '123',
                }},
        },
        {
            amount: '20',
            currency: 'USD',
            refId: '1234b',
            description: 'order2',
            destination: {
                sepa: {
                    iban: '123',
                },
            },
        },
        {
            amount: '30',
            currency: 'USD',
            refId: '1234c',
            description: 'order1',
            destination: {
                sepa: {
                    iban: '123',
                },
            },
        },
    ];
    const source = {
        account: {
            token: {
                memberId: payer._id,
                accountId,
            },
        },
        customerData: {
            legalNames: ['Southside'],
        },
    };

    // Payer creates the token with the desired terms
    const bulkTransferTokenBuilder = await payer.createBulkTransferTokenBuilder(transfers, '70', source)
        .setToAlias(payeeAlias)
        // if not explicitly set, will get random refId:
        .setRefId(purchaseId)
        .buildPayload();

    const {resolvedPayload, policy} = await payer.prepareToken(bulkTransferTokenBuilder);
    const signature = [await payer.signTokenPayload(resolvedPayload, policy.singleSignature.signer.keyLevel)];
    const bulkTransferToken = await payer.createToken(resolvedPayload, signature);
    // Payer endorses the token, creating a digital signature on it
    const endorsed = await payer.endorseToken(bulkTransferToken);
    return endorsed.token;
};
