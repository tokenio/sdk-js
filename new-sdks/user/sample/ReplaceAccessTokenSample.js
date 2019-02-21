/**
 * Replace an existing access token.
 *
 * @param {Member} grantor - grantor member
 * @param {Object} oldToken - token to replace
 * @return {Object} new token
 */
export default async (grantor, oldToken) => {
    const account = (await grantor.getAccounts())[0];
    const replaceResult = await grantor.replaceAccessToken(
        oldToken,
        [
            {account: {accountId: account.id()}},
            {balance: {accountId: account.id()}},
        ]
    );
    const endorseResult = await grantor.endorseToken(
        replaceResult.token);
    return endorseResult.token;
};
