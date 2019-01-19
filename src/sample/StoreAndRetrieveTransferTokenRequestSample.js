import {TokenIO} from '..';

const devKey = require('../../src/config.json').devKey[TEST_ENV];
const Token = new TokenIO({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Creates a transfer token request and retrieve it.
 *
 * @param {Member} payee - member that will create the TokenRequest, and receive the funds
 * @return {Object} retrieved token request
 */
export default async payee => {
    const tokenRequest = Token.createTransferTokenRequest({
        lifetimeAmount: '10.00',
        currency: 'EUR',
    })
        .setToMemberId(payee.memberId())
        .setFromAlias('EMAIL', 'payerEmail@gmail.com')
        .setDescription('Book Purchase')
        .setRedirectUrl('https://token.io/callback')
        .setBankId('iron');
    const request = await payee.storeTokenRequest(tokenRequest);

    return await Token.retrieveTokenRequest(request.id);
};
