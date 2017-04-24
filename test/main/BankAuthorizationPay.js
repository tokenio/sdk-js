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

let destination1 = {
    sepaDestination: {
        iban: '123',
    }
};

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const auth = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
};

// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
    const auth = await BankClient.requestLinkAccounts(username2, 100000, 'EUR');
    const accs = await member2.linkAccounts(auth);
    account2 = accs[0];
};

describe('Bank Authorization Payments', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create a token from a bank authorization', async () => {
        const auth = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const token = await member1.createTransferTokenWithAuth(auth, 100, 'EUR', username2,
            'lunch', 0, [destination1]);
        const tokenLookedUp = await member1.getToken(token.id);
        assert.isOk(token);
        assert.isOk(token.payload);
        assert.isOk(token.payload.from.id);
        assert.isOk(token.payload.to.id);
        assert.isOk(token.payload.transfer.redeemer);
        assert.isOk(token.payload.transfer.instructions);
        assert.isOk(token.payload.transfer.quote);
        assert.isOk(tokenLookedUp.payload.transfer.instructions);
    });

    it('should make a payment from a bank authorization', async () => {
        const auth = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const token = await member1.createTransferTokenWithAuth(auth, 100, 'EUR', username1,
            'lunch', 0, [destination1]);
        await member1.endorseToken(token.id);
        const transfer = await member1.redeemToken(token.id, 54, 'EUR');
        assert.equal(transfer.status, 'SUCCESS');
    });
});
