import TestUtil from './TestUtil';
import {TokenClient} from '../src';

const devKey = require('../src/config.json').devKey[TEST_ENV];
const {assert} = require('chai');

const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});

describe('Token library', () => {
    it('should perform a transfer flow', async () => {
        const alias1 = Token.Util.randomAlias();
        const alias2 = Token.Util.randomAlias();

        const member1 = await TestUtil.createUserMember(alias1);
        await member1.subscribeToNotifications('iron');
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const accounts = await member1.linkAccounts(auth);
        const account = accounts[0];

        const member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);

        const token = await member1.createTransferTokenBuilder(100.00, 'EUR')
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
