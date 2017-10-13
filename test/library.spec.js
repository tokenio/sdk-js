import TestUtil from './TestUtil';
import TokenIo from "../src";
const devKey = require("../src/config.json").devKey[TEST_ENV];
const Token = new TokenIo(TEST_ENV, devKey);
const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

describe('Token library', () => {
    it("should perform a transfer flow", async () => {
        const alias1 = Token.Util.randomAlias();
        const alias2 = Token.Util.randomAlias();

        const member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
        await member1.subscribeToNotifications("iron");
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const accounts = await member1.linkAccounts(auth);
        const account = accounts[0];

        const member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);

        const token = await member1.createTransferToken(100.00, 'EUR')
            .setAccountId(account.id)
            .setToAlias(alias2)
            .setRedeemerAlias(alias2)
            .execute();

        await member1.endorseToken(token.id);

        await member2.redeemToken(token.id, 5, 'EUR', 'lunch', [{
            account: {
                sepa: {
                    iban: Token.Util.generateNonce(),
                }
            }
        }]);

        await TestUtil.waitUntil(async () => {
            const transfers = await member1.getTransfers(token.id, null, 100);
            assert.isAtLeast(transfers.data.length, 1);
        });
    });
});
