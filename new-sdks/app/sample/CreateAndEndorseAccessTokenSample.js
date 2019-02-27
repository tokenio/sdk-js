/**
 * Creates a access token and endorses it to a grantee.
 *
 * @param {Member} grantor - member that will give access
 * @param {Object} granteeAlias - alias of the member that will be granted access
 * @return {Object} endorsed token
 */
export default async (grantor, granteeAlias) => {
    // Get grantor's accounts
    const accounts = await grantor.getAccounts();

    // Grantor creates the token with the desired terms
    const token = await grantor.createAccessTokenBuilder()
        .forAccount(accounts[0].id())
        .forAccountBalance(accounts[0].id())
        .setToAlias(granteeAlias)
        .execute();

    // Grantor endorses the token, creating and submitting a digital signature
    const result = await grantor.endorseToken(token);

    return result.token;
};
