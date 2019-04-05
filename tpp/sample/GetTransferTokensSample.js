/**
 * Gets a list of transfer tokens associated with a member.
 *
 * @param {Member} member
 * @return {Object} transfer tokens
 */
export default async member => {
    const pagedResult = await member.getTransferTokens('', 10);
    return pagedResult.tokens;
};
