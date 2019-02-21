import {TokenClient} from '../src';

const devKey = require('../src/config.json').devKey[TEST_ENV];
const Token = new TokenClient({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Creates a transfer token request and retrieve it.
 *
 * @param {Member} payee - member that will create the TokenRequestBuilder, and receive the funds
 * @return {Object} retrieved token request
 */
export default async payee => {
    const tokenRequest = Token.createTransferTokenRequest(10.00, 'EUR')
        .setToMemberId(payee.memberId())
        .setFromAlias('EMAIL', 'payerEmail@gmail.com')
        .setDescription('Book Purchase')
        .setRedirectUrl('https://token.io/callback')
        .setBankId('iron');
    const request = await payee.storeTokenRequest(tokenRequest);

    return await Token.retrieveTokenRequest(request.id);
};
