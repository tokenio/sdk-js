import {TokenIO} from '..';

const devKey = require('../../src/config.json').devKey[TEST_ENV];
const Token = new TokenIO({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Creates a access token request and retrieve it.
 *
 * @param {Member} grantee - member that will create the TokenRequest, and receive the funds
 * @return {Object} retrieved token request
 */
export default async grantee => {
    // Construct payload
    const payload = {
        to: {
            id: grantee.memberId(),
        },
        accessBody: {
            type: ['ACCOUNTS', 'BALANCES'],
        },
        description: 'Book purchase',
        redirectUrl: 'https://token.io/callback',
    };

    // Create token request to be stored
    const tokenRequest = Token.TokenRequest.create(payload)
        .setFromEmail('grantorEmail@gmail.com')
        .setBankId('iron');

    const request = await grantee.storeTokenRequest(tokenRequest);
    return await Token.retrieveTokenRequest(request.id);
};
