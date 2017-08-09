/**
 * Creates a transfer token from a bank authorization
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
          .addDestination({
                account: {
                    sepa: {
                        iban: 'DE89 3704 0044 0532 0130 00',
                    },
                }
            })
          .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
};
