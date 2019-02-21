/**
 * Gets transaction information about a recently-completed transfer.
 *
 * @param {Member} payer - member
 * @param {string} accountId - recently-completed transfer
 * @return {Object} Account structure
 */
export default async (payer, accountId) => {
    return await payer.getAccount(accountId);
};
