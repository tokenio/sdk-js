/**
 * Gets information about a bulk transfer.
 *
 * @param {Member} payer - member
 * @param {Object} bulkTransferToken - bulkTransferToken
 * @return {Object} bulk transfer record
 */
export default async (payer, bulkTransferToken) => {
    return await payer.getBulkTransfer(bulkTransferToken.id);
};
