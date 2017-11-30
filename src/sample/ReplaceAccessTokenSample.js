/**
 * Replace an existing access token.
 *
 * @param {Member} grantor - grantor member
 * @param {Object} oldToken - token to replace
 * @return {Object} result - new token
 */
export default async (grantor, oldToken) => {
    const replaceResult = await grantor.replaceAccessToken(
        oldToken,
        [{allAddresses: {}}]);
    const endorseResult = await grantor.endorseToken(
        replaceResult.token);
    return endorseResult.token;
};
