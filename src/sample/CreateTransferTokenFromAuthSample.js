/**
 * Creates a transfer token from a bank authorization
 *
 * @param {Member} payer - member that will fund the token
 * @param {string} payeeUsername - username of the payee member
 * @return {Object} token - endorsed token
 */
export default async (payer, payeeUsername) => {
    const payerUsername = await payer.firstUsername();

    // Instead of a previously-linked account, the user can use an authorization from the bank.
    // Here, we simulate getting authorization via createTestBankAccount.
    const bankAuthorization = await payer.createTestBankAccount(120.0, "EUR");

    // Payer creates the token with the desired terms
    const token = await payer.createTransferToken(100.00, 'EUR')
          .setBankAuthorization(bankAuthorization)
          .setRedeemerUsername(payerUsername)
          .setToUsername(payeeUsername)
          .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
};
