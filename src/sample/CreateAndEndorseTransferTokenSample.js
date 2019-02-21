import Util from '../Util';

/**
 * Creates a transfer token and endorses it to a payee.
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

    // Payer creates the token with the desired terms
    const token = await payer.createTransferTokenBuilder(100.00, 'EUR')
        .setFromId(payer.memberId())
        .setAccountId(accounts[0].id)
        .setToAlias(payeeAlias)
    // if not explicitly set, will get random refId:
        .setRefId(purchaseId)
        .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
};
