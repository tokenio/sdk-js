import {Resource} from '..';

/**
 * Creates a access token and endorses it to a grantee.
 *
 * @param {Member} grantor - member that will give access
 * @param {Object} granteeAlias - alias of the member that will be granted access
 * @return {Object} endorsed token
 */
export default async (grantor, granteeAlias) => {
    // Grantor creates the token with the desired terms
    const token = await grantor.createAccessToken(
        granteeAlias,
        [
            Resource.create({allAccounts: {}}), // app can call getAccounts
            Resource.create({allBalances: {}}), // for each account, can getBalance
        ]);

    // Grantor endorses the token, creating and submitting a digital signature
    const result = await grantor.endorseToken(token);

    return result.token;
};
