import config from '../src/config.json';

/**
 * Gets information about a recently-completed bulk transfer.
 *
 * @param {Member} payer - member
 * @param {String} bulkTransferId - bulk transfer ID
 * @return {Object} bulk transfer record
 */
export default async (payer, bulkTransferId) => {
    return await payer.getBulkTransfer(bulkTransferId);
};
