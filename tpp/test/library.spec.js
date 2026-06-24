import TestUtil from './TestUtil';
import {TokenClient} from '../src';

const devKey = require('../src/config.json').devKey[TEST_ENV];
const {assert} = require('chai');

const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});

describe('Token library', () => {
    it('should set custom headers on TokenClient and Member', () => {
        Token.setCustomHeaders({
            'token-trace-initial-service-name': 'Node Server',
            'token-trace-initial-endpoint-type': 'REST_STANDALONE',
        });

        // Verify headers stored in options for propagation to members
        assert.equal(
            Token.options.customHeaders['token-trace-initial-service-name'],
            'Node Server');
        assert.equal(
            Token.options.customHeaders['token-trace-initial-endpoint-type'],
            'REST_STANDALONE');

        // Verify headers set on unauthenticated client
        assert.equal(
            Token._unauthenticatedClient._context.miscHeaders['token-trace-initial-service-name'],
            'Node Server');

        // Additional headers merge
        Token.setCustomHeaders({
            'token-trace-initiated-by': 'FRONTEND',
        });
        assert.equal(
            Token._unauthenticatedClient._context.miscHeaders['token-trace-initiated-by'],
            'FRONTEND');
        assert.equal(
            Token._unauthenticatedClient._context.miscHeaders['token-trace-initial-service-name'],
            'Node Server');

        Token.clearCustomHeaders();
        assert.deepEqual(Token.options.customHeaders, {});
        assert.deepEqual(Token._unauthenticatedClient._context.miscHeaders, {});
    });

    it('should perform a transfer flow', async () => {
        const alias1 = Token.Util.randomAlias();
        const alias2 = Token.Util.randomAlias('DOMAIN');

        const member1 = await TestUtil.createUserMember(alias1);
        await member1.subscribeToNotifications('iron');
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const accounts = await member1.linkAccounts(auth);
        const account = accounts[0];

        const member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);

        const token = await member1.createTransferTokenBuilder(5.0, 'EUR')
            .setAccountId(account.id())
            .setToAlias(alias2)
            .execute();

        await member1.endorseToken(token.id);

        await member2.redeemToken(token.id, 5, 'EUR', 'lunch', [{
            account: {
                sepa: {
                    iban: Token.Util.generateNonce(),
                },
            },
        }]);

        await TestUtil.waitUntil(async () => {
            const transfers = await member1.getTransfers(token.id, null, 100);
            assert.isAtLeast(transfers.transfers.length, 1);
        });
    });

    it('should create a member with no aliases', async () => {
        const guest = await Token.createMember(null, Token.MemoryCryptoEngine);
        const aliases = await guest.aliases();
        assert.equal(aliases.length, 0);
    });
});
