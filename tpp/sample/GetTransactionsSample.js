import config from '../src/config.json';

/**
 * Gets a member's recent transactions
 *
 * @param {Member} payer - payer member
 * @return {Object} array of transactions
 */
export const GetTransactions = async payer => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id();

    const pagedResult = await payer.getTransactions(
        accountId,
        '',
        10,
        config.KeyLevel.STANDARD);
    return pagedResult.transactions;
};

/**
 * Gets a member's recent transactions
 *
 * @param {Member} payer - payer member
 * @return {Object} array of transactions
 */
export const GetTransactionsWithDate = async payer => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id();

    const pagedResult = await payer.getTransactions(
        accountId,
        '',
        10,
        config.KeyLevel.STANDARD,
        '2019-06-10',
        '2019-10-10');
    return pagedResult.transactions;
};
