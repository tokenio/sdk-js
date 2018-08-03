const devKey = require('../../src/config.json').devKey[TEST_ENV];
const TokenLib = require('../../src');
const Token = new TokenLib(TEST_ENV, devKey, './keys');

/**
 * Creates a transfer token request and retrieve it.
 *
 * @param {Member} payee - member that will create the TokenRequest, and receive the funds
 * @return {Object} tokenRequest - retrieved token request
 */
export default async (payee) => {
    const builder = payee.createTransferTokenBuilder(100.00, 'EUR')
        .setDescription('Book purchase')
        .setToMemberId(payee.memberId());

    const tokenRequest = Token.TokenRequest.create(builder.build())
        .setEmail('payerEmail@gmail.com')
        .setBankId('iron')
        .setRedirectUrl('https://token.io/callback');

    const request = await payee.storeTokenRequest(tokenRequest);

    return await Token.retrieveTokenRequest(request.id);
};
