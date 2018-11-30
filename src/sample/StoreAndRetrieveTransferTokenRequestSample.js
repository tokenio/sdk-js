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
    const payload = {
        to: {
            id: payee.memberId(),
        },
        transferBody: {
            lifetimeAmount: '100.00',
            currency: 'EUR',
        },
        description: 'account and balance access',
        redirectUrl: 'https://token.io/callback',
    };
    const tokenRequest = Token.TokenRequest.create(payload)
        .setFromEmail('payerEmail@gmail.com')
        .setBankId('iron');
    const request = await payee.storeTokenRequest(tokenRequest);

    return await Token.retrieveTokenRequest(request.id);
};
