/**
 * Gets transaction information about a recently-completed transfer.
 *
 * @param {Member} payer - member
 * @param {string} accountId - recently-completed transfer
 * @return {Object} Account structure
 */
export default async (payer, accountId) => {
    const account = await payer.getAccount(accountId);
    return account;
};
