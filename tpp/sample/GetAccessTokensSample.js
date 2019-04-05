/**
 * Gets a list of access tokens associated with the member.
 *
 * @param {Member} member
 * @return {Object} access tokens
 */
export default async member => {
    const pagedResult = await member.getAccessTokens('', 10);
    return pagedResult.tokens;
};
