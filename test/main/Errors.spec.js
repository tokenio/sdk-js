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

let token1 = {};

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
    await member2.linkAccounts(alp);
};

// Set up an endorsed transfer token
const setUp3 = async () => {
    const token = await member1.createTransferToken(38.71, 'EUR')
        .setAccountId(account1.id)
        .setRedeemerUsername(username2)
        .setToUsername(username2)
        .execute();
    await member1.endorseToken(token.id);
    token1 = await member2.getToken(token.id);
};

describe('Error handling', () => {
    before(() => Promise.all([setUp1(), setUp2()]));
    beforeEach(setUp3);

    it('Promise should reject', async() => {
        try {
            const err = await member2.redeemToken(token1, 10000, 'EUR');
            return Promise.reject(new Error("Call should fail"));
        } catch (err) {
            assert.include(err.message, "redeemToken");
            assert.include(err.message, "PRECONDITION");
        }
    });
});
