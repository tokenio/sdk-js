const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';
let account2 = {};

let token1 = {};
let transfer1 = {};

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
    const accs = await member1.linkAccounts(alp);
    account1 = accs[0];
};

// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
    const alp = await BankClient.requestLinkAccounts(username2, 100000, 'EUR');
    const accs = await member2.linkAccounts(alp);
    account2 = accs[0];
};

// Set up an endorsed transfer token
const setUp3 = async () => {
    token1 = await member1.createTransferToken(38.71, 'EUR')
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
    return await member1.endorseToken(token1.id);
};

describe('Empty transfers', () => {
    before(async () => {
        await Promise.all([setUp1(), setUp2()]);
        await setUp3();
    });

    it('should see an empty transfers list', async () => {
        const transfers = await member1.getTransfers(token1.id, 0, 100);
        assert.equal(transfers.data.length, 0);
    });
});
