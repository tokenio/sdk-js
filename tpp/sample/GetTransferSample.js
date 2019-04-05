/**
 * Gets one transfer.
 *
 * @param {Member} payer - payer member
 * @param {string} transferId - ID of transfer to get
 * @return {Object} transfer
 */
export default async (payer, transferId) => {
    return await payer.getTransfer(transferId);
};
