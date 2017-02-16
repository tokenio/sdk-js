import tokenIo from "../src";
const Token = new tokenIo(TEST_ENV);
const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

import BankClient from "./sample/BankClient";

describe('Token library', () => {
    it("should perform a transfer flow", async () => {
        const username1 = Token.Util.generateNonce();
        const username2 = Token.Util.generateNonce();

        // For testing push notifications
        const pushToken = '36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a10535581f97900';

        const member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
        await member1.subscribeToNotifications(pushToken);
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const accounts = await member1.linkAccounts("iron", alp);
        const account = accounts[0];

        const member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);

        const token = await member1.createTransferToken(account.id, 9.24, 'EUR', username2);
        await member1.endorseToken(token.id);

        await member2.redeemToken(token.id, 5, 'EUR');
        const transfers = await member1.getTransfers(token.id, null, 100);

        assert.isAtLeast(transfers.data.length, 1);
    });
});
