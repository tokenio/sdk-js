/**
 * Get access tokens.
 *
 * @param {Member} grantor - grantor member
 * @param {Object} granteeAlias - alias of token to find
 * @return {Object} result - access token
 */
export default async (grantor, granteeAlias) => {
    const tokens = await grantor.getAccessTokens(0, 100);
    return tokens.data.find(function(t) {
        return t.payload.to.alias.value === granteeAlias.value;
    });
};
