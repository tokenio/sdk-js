/**
 * Creates a transfer token with some unusual options. Endorses it.
 *
 * @param {Member} payer - member that will fund the token
 * @param {Member} payee - payee member
 * @return {Object} endorsed token
 */
export default async (payer, payee) => {
    const payeeId = payee.memberId();
    const accounts = await payer.getAccounts();
    const now = new Date().getTime();

    // Payer creates the token with the desired terms
    const token = await payer.createTransferTokenBuilder(120.00, 'EUR')
        .setAccountId(accounts[0].id())
        .setToMemberId(payeeId)
        .setEffectiveAtMs(now + 1000)       // effective in one second
        .setExpiresAtMs(now + (300 * 1000)) // expires in 300 seconds
        .setRefId('a713c8a61994a749')
        .setChargeAmount(10.0)
        .setDescription('Book purchase')
        .setPurposeOfPayment('PERSONAL_EXPENSES')
        .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
};
