import {TokenClient} from '../src';
const devKey = require('../src/config.json').devKey[TEST_ENV];
const Token = new TokenClient({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Creates a bulk transfer token request and retrieve it.
 *
 * @param {Member} grantee - member that will create the TokenRequestBuilder and receive access
 * @return {Object} retrieved token request
 */
export default async grantee => {
    // Create token request to be stored
    const accountId = (await grantee.getAccounts())[0].id();
    const transfers = [
        {
            amount: '20',
            currency: 'USD',
            refId: '1234a',
            description: 'order1',
            destination: {
                sepa: {
                    iban: '123',
                }},
        },
        {
            amount: '20',
            currency: 'USD',
            refId: '1234b',
            description: 'order2',
            destination: {
                sepa: {
                    iban: '123',
                },
            },
        },
        {
            amount: '30',
            currency: 'USD',
            refId: '1234c',
            description: 'order1',
            destination: {
                sepa: {
                    iban: '123',
                },
            },
        },
    ];
    const source = {
        account: {
            token: {
                memberId: grantee._id,
                accountId,
            },
        },
        customerData: {
            legalNames: ['Southside'],
        },
    };
    const tokenRequest = await Token.createBulkTransferTokenRequest(transfers, '70')
        .setRedirectUrl('https://token.io/callback')
        .setSource(source)
        .setFromAlias('EMAIL', 'grantorEmail@gmail.com')
        .setToMemberId(grantee.memberId())
        .setBankId('iron');
    const request = await grantee.storeTokenRequest(tokenRequest);
    return await Token.retrieveTokenRequest(request.id);
};
