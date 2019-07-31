import config from '../src/config.json';

/**
 * Gets information about a recently-completed standing order.
 *
 * @param {Member} payer - member
 * @param {Object} standingOrder - recently-completed standing order
 * @return {Object} standing order record
 */
export default async (payer, transfer) => {
    const accounts = await payer.getAccounts();
    const accountId = accounts[0].id();

    const transactionId = transfer.transactionId;
    return await payer.getTransaction(
        accountId,
        transactionId,
        config.KeyLevel.STANDARD);
};
