/**
 * Gets a member's recent transactions
 *
 * @param {Member} payer - payer member
 * @return {Object} array of transactions
 */
export default async (payer) => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id;

    const pagedResult = await payer.getTransactions(
        accountId,
        "",
        10);
    return pagedResult.data;
};

