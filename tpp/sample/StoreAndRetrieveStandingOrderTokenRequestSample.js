import {TokenClient} from '../src';

const devKey = require('../src/config.json').devKey[TEST_ENV];
const Token = new TokenClient({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Creates a standing order submission token request and retrieve it.
 *
 * @param {Member} grantee - member that will create the TokenRequestBuilder and receive access
 * @return {Object} retrieved token request
 */
export default async grantee => {
    // Create token request to be stored
    const tokenRequest = Token.createStandingOrderTokenRequest(
        10, 'EUR', 'MNTH', '2020-02-15', '2021-02-15'
    )
        .setDescription('Monthly music subscription')
        .setRedirectUrl('https://token.io/callback')
        .setFromAlias('EMAIL', 'grantorEmail@gmail.com')
        .setToMemberId(grantee.memberId())
        .setBankId('iron');

    const request = await grantee.storeTokenRequest(tokenRequest);
    return await Token.retrieveTokenRequest(request.id);
};
