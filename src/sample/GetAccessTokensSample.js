/**
 * Get access tokens.
 *
 * @param {Member} grantor - grantor member
 * @param {string} granteeUsername - username of token to find
 * @return {Object} result - access token
 */
export default async (grantor, granteeUsername) => {
    const tokens = await grantor.getAccessTokens(0, 100);
    return tokens.data.find(function(t) {
        return t.payload.to.username === granteeUsername;
    });
};
