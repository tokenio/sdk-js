/**
 * Gets information about a standing order submission.
 *
 * @param {Member} payer - member
 * @param {Object} standingOrderToken - standingOrderToken
 * @return {Object} standing order submission
 */
export default async (payer, standingOrderToken) => {
    const {id} = standingOrderToken;
    return await payer.getStandingOrderSubmission(id);
};
