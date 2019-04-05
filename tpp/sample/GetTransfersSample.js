/**
 * Gets a member's recent transfers
 *
 * @param {Member} payer - payer member
 * @return {Object} array of transfers
 */
export default async payer => {
    const pagedResult = await payer.getTransfers('', '', 10);
    return pagedResult.transfers;
};
