/**
 * Creates a transfer token and endorses it to a payee.
 *
 * @param {Member} payer - member that will fund the token
 * @param {Object} payeeAlias - alias of the payee member
 * @return {Object} token - endorsed token
 */
export default async (payer, payeeAlias) => {
    const accounts = await payer.getAccounts();

    // Payer creates the token with the desired terms
    const token = await payer.createTransferToken(100.00, 'EUR')
            .setAccountId(accounts[0].id)
            .setRedeemerAlias(payeeAlias)
            .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
};
