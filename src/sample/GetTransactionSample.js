import config from '../config.json';

/**
 * Gets transaction information about a recently-completed transfer.
 *
 * @param {Member} payer - member
 * @param {Object} transfer - recently-completed transfer
 * @return {Object} transaction record for that transfer
 */
export default async (payer, transfer) => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id;

    const transactionId = transfer.transactionId;
    const transaction = await payer.getTransaction(
        accountId,
        transactionId,
        config.KeyLevel.STANDARD);

    return transaction;
};
