/* eslint-disable no-unused-vars*/
/**
 * Links a Token member and a bank.
 *
 * @param {Member} member - Token member to link to a bank
 */
export default async member => {
    // Generates a test bank account that we can link with.
    // Gives us an encrypted authorization.
    const auth = await member.createTestBankAccount(200, 'EUR');

    // Links the account by sending the authorization.
    const accounts = await member.linkAccounts(auth);
};
