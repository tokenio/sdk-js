import tokenIo from "../src";
const Token = new tokenIo(TEST_ENV);
const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

describe('Token library', () => {
    it("should perform a transfer flow", async () => {
        const username1 = Token.Util.generateNonce();
        const username2 = Token.Util.generateNonce();

        // For testing push notifications
        const pushToken = '36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a10535581f97900';

        const member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
        await member1.subscribeToNotifications("iron");
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const accounts = await member1.linkAccounts(auth);
        const account = accounts[0];

        const member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);

        const token = await member1.createTransferToken(100.00, 'EUR')
            .setAccountId(account.id)
            .setToUsername(username2)
            .setRedeemerUsername(username2)
            .execute();

        await member1.endorseToken(token.id);

        await member2.redeemToken(token.id, 5, 'EUR', 'lunch', [{
            account: {
                token: {
                    accountId: Token.Util.generateNonce(),
                    memberId: Token.Util.generateNonce(),
                }
            }
        }]);
        const transfers = await member1.getTransfers(token.id, null, 100);

        assert.isAtLeast(transfers.data.length, 1);
    });
});
