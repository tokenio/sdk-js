/**
 * Replace an existing access token.
 *
 * @param {Member} grantor - grantor member
 * @param {Object} oldToken - token to replace
 * @return {Object} result - new token
 */
export default async (grantor, oldToken) => {
    const result = await grantor.replaceAndEndorseAccessToken(
        oldToken,
        [{allAddresses: {}}]);
    return result.token;
};
