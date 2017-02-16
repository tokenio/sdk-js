/**
 * Creates a transfer token and endorses it to a payee.
 *
 * @param {Member} payer - member that will fund the token
 * @param {string} payeeUsername - username of the payee member
 */
export default async (payer, payeeUsername) => {
    const accounts = await payer.getAccounts();

    // Payer creates the token with the desired terms
    const token = await payer.createTransferToken(accounts[0].id, 100.0, 'EUR', payeeUsername);

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
}
