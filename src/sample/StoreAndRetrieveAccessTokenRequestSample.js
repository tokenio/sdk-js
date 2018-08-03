const devKey = require('../../src/config.json').devKey[TEST_ENV];
const TokenLib = require('../../src');
const Token = new TokenLib(TEST_ENV, devKey, './keys');

/**
 * Creates a access token request and retrieve it.
 *
 * @param {Member} grantee - member that will create the TokenRequest, and receive the funds
 * @return {Object} tokenRequest - retrieved token request
 */
export default async (grantee) => {
    const builder = grantee.createAccessTokenBuilder()
        .setDescription('balance access')
        .forAllBalances()
        .setToMemberId(grantee.memberId());

    const tokenRequest = Token.TokenRequest.create(builder.build())
        .setEmail('grantorEmail@gmail.com')
        .setBankId('iron')
        .setRedirectUrl('https://token.io/callback');

    const request = await grantee.storeTokenRequest(tokenRequest);
    return await Token.retrieveTokenRequest(request.id);
};
