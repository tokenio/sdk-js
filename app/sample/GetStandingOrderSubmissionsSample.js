/**
 * Gets information about a recently-completed standing order.
 *
 * @param {Member} payer - member
 * @param {String} offset - offset
 * @param {Number} limit - limit
 * @return {Object} standing order submission
 */
export default async (payer, offset, limit) => {
    const pagedResult = await payer.getStandingOrderSubmissions(offset, limit);
    return pagedResult.submissions;
};