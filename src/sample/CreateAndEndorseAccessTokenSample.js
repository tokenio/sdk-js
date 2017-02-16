/**
 * Creates a access token and endorses it to a grantee.
 *
 * @param {Member} grantor - member that will give access
 * @param {string} granteeUsername - username of the member that will be granted access
 * @return {Object} token - endorsed token
 */
export default async (grantor, granteeUsername) => {
    // Grantor creates the token with the desired terms
    const token = await grantor.createAccessToken(granteeUsername, [{ allAccounts: {} }]);

    // Grantor endorses the token, creating and submitting a digital signature
    const result = await grantor.endorseToken(token);

    return result.token;
}
