const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

import {defaultCurrency} from "../../src/constants";
const some = require('lodash/some');
const map = require('lodash/map');

let member1 = {};
let username1 = '';
let account1 = {};

let username2 = '';
let member2 = {};

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const auth = await member1.createTestBankAccount(100000, 'EUR');
    const accs = await member1.linkAccounts(auth);
    account1 = accs[0];
};

// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
};

describe('Tokens', () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should confirm username does not exist', async () => {
        const randomUsername = Token.Util.generateNonce();
        const exists = await Token.usernameExists(randomUsername);
        assert.equal(exists, false);
    });

    it('should confirm username exists', async () => {
        const username = Token.Util.generateNonce();
        await member1.addUsername(username);
        const exists = await Token.usernameExists(username);
        assert.equal(exists, true);
    });

    it('should create a token, look it up, and endorse it', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        assert.isAtLeast(token.id.length, 5);
        assert.equal(token.payload.version, '1.0');
        assert.equal(token.payload.issuer.username, 'iron');
        assert.equal(token.payload.from.id, member1.memberId());
        assert.equal(token.payload.description, undefined);
        assert.equal(token.payload.transfer.redeemer.username, username2);
        assert.equal(token.payload.transfer.lifetimeAmount, 9.24);
        assert.equal(token.payload.transfer.currency, defaultCurrency);

        const tokenLookedUp = await member1.getToken(token.id);
        assert.equal(token.id, tokenLookedUp.id);

        const res = await member1.endorseToken(token);
        assert.equal(token.payloadSignatures.length, 2);
        assert.equal(res.token.payloadSignatures.length, 2);
        assert.equal(res.status, 'SUCCESS');
    });

    it('should create a token and endorse it by id', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        const res = await member1.endorseToken(token.id);
        assert.equal(res.status, 'SUCCESS');

        const lookedUp = await member1.getToken(token.id);
        assert.equal(lookedUp.payloadSignatures.length, 2);
        assert.equal(lookedUp.payloadSignatures[0].action, 'ENDORSED');
    });

    it('should create a token and cancel it', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        const res = await member1.cancelToken(token);
        assert.equal(token.payloadSignatures.length, 2);
        assert.equal(token.payloadSignatures[0].action, 'CANCELLED');
        assert.equal(res.status, 'SUCCESS');
    });

    it('should create token and cancel it by id', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        const res = await member1.cancelToken(token.id);
        assert.equal(res.status, 'SUCCESS');

        const lookedUp = await member1.getToken(token.id);
        assert.equal(lookedUp.payloadSignatures.length, 2);

        const actions = map(lookedUp.payloadSignatures, sig => sig.action);
        assert.isOk(some(actions, action => action === 'CANCELLED'));
    });

    it('should create token, and look it up', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        await member1.endorseToken(token.id);
        const pagedResult = await member1.getTransferTokens(null, 100);
        assert.isAtLeast(pagedResult.data.length, 1);
        assert.isString(pagedResult.offset);
    });

    it('should create token, and look it up, second member', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        await member1.endorseToken(token.id);
        const pagedResult = await member2.getTransferTokens(null, 100);
        assert.equal(pagedResult.data.length, 0);
    });

    it('should create token, and look it up, second member, tokenId', async () => {
        const token = await member1.createTransferToken(9.24, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
        await member1.endorseToken(token.id);
        const lookedUp = await member2.getToken(token.id);
        assert.equal(lookedUp.id, token.id);
    });
});
