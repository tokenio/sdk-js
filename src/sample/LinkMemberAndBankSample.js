/**
 * Links a Token member and a bank.
 *
 * The bank linking is currently only supported by the Token PSD2 IOS mobile app.
 * This sample is implemented for a very high level illustration of the bank linking concept
 * and serves as an integral building block connecting other samples. The desktop version of
 * the bank linking process is in the development. Until it's ready, please use Token PSD2 IOS
 * mobile app to link Token members and banks.
 *
 * @param {Member} member - Token member to link to a bank
 */
export default async (member) => {
    const res = await member.createTestBankAccount(200, 'EUR');
    const accounts = await member.linkAccounts(res.bankId, res.payloads);
}
