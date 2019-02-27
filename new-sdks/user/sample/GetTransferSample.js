/**
 * Gets one transfer.
 *
 * @param {Member} payer - payer member
 * @param {string} transferId - ID of transfer to get
 * @return {Object} array of transactions
 */
export default async (payer, transferId) => {
    const transfer = await payer.getTransfer(transferId);
    return transfer;
};
