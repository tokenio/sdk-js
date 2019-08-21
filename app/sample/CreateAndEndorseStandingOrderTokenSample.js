import Util from '../src/Util';

/**
 * Creates a standing prder token and endorses it to a payee.
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

    const accounts = await payer.getAccounts();

    const destination = {
        sepa: {
            iban: '123',
        },
    };

    // Payer creates the token with the desired terms
    const standingOrderTokenBuilder = await payer.createStandingOrderTokenBuilder(100.00, 'EUR', 'MNTH', '2018-02-15', '2019-02-15')
        .setAccountId(accounts[0].id())
        .setToAlias(payeeAlias)
    // if not explicitly set, will get random refId:
        .setRefId(purchaseId)
        .addTransferDestination(destination)
        .buildPayload();

    const {resolvedPayload, policy} = await payer.prepareToken(standingOrderTokenBuilder);
    const signature = [await payer.signTokenPayload(resolvedPayload, policy.singleSignature.signer.keyLevel)];
    const standingOrderToken = await payer.createToken(resolvedPayload, signature);
    // Payer endorses the token, creating a digital signature on it
    const endorsed = await payer.endorseToken(standingOrderToken);
    return endorsed.token;
};
