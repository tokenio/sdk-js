const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import KeyLevel from "../../src/main/KeyLevel";
import TokenOperationResult from "../../src/main/TokenOperationResult";
import BankClient from "../sample/BankClient";
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
    username1 = Crypto.generateKeys().keyId;
    member1 = await Token.createMember(username1);
    const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
    const accs = await member1.linkAccounts('iron', alp);
    account1 = accs[0];
};

// Set up a second member
const setUp2 = async () => {
    username2 = Crypto.generateKeys().keyId;
    member2 = await Token.createMember(username2);
};

describe('Tokens', () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should confirm username does not exist', async () => {
      const exists = await Token.usernameExists(Crypto.generateKeys().keyId);
      assert.equal(exists, false);
    });

    it('should confirm username exists', async () => {
      const username = Crypto.generateKeys().keyId;
      await member1.addUsername(username);
      const exists = await Token.usernameExists(username);
      assert.equal(exists, true);
    });

    it('should create a token, look it up, and endorse it', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);

        assert.isAtLeast(token.id.length, 5);
        assert.equal(token.version, '1.0');
        assert.equal(token.issuer.id, 'iron');
        assert.equal(token.from.id, member1.id);
        assert.equal(token.description, undefined);
        assert.equal(token.redeemer.username, username2);
        assert.equal(token.lifetimeAmount, 9.24);
        assert.equal(token.currency, defaultCurrency);

        const tokenLookedUp = await member1.getToken(token.id);
        assert.equal(token.id, tokenLookedUp.id);

        const res = await member1.endorseToken(token);
        assert.equal(token.payloadSignatures.length, 2);
        assert.equal(res.token.payloadSignatures.length, 2);
        assert.equal(res.status, TokenOperationResult.Status.SUCCESS)
    });

    it('should create a token and endorse it by id', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);
        const res = await member1.endorseToken(token.id);
        assert.equal(res.status, TokenOperationResult.Status.SUCCESS)

        const lookedUp = await member1.getToken(token.id);
        assert.equal(lookedUp.payloadSignatures.length, 2);
        assert.equal(lookedUp.payloadSignatures[0].action, 'ENDORSED');
    });

    it('should create a token and cancel it', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);
        const res = await member1.cancelToken(token);
        assert.equal(token.payloadSignatures.length, 2);
        assert.equal(token.payloadSignatures[0].action, 'CANCELLED');
        assert.equal(res.status, TokenOperationResult.Status.SUCCESS)
    });

    it('should create token and cancel it by id', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);
        const res = await member1.cancelToken(token.id);
        assert.equal(res.status, TokenOperationResult.Status.SUCCESS)

        const lookedUp = await member1.getToken(token.id);
        assert.equal(lookedUp.payloadSignatures.length, 2);

        const actions = map(lookedUp.payloadSignatures, sig => sig.action);
        assert.isOk(some(actions, action => action === 'CANCELLED'));
    });

    it('should create token, and look it up', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);
        await member1.endorseToken(token.id);
        const pagedResult = await member1.getTransferTokens(null, 100);
        assert.isAtLeast(pagedResult.data.length, 1);
        assert.isString(pagedResult.offset);
    });

    it('should create token, and look it up, second member', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);
        await member1.endorseToken(token.id);
        const pagedResult = await member2.getTransferTokens(null, 100);
        assert.equal(pagedResult.data.length, 0);
    });

    it('should create token, and look it up, second member, tokenId', async () => {
        const token = await member1.createToken(account1.id, 9.24, defaultCurrency, username2);
        await member1.endorseToken(token.id)
        const lookedUp = await member2.getToken(token.id);
        assert.equal(lookedUp.id, token.id);
    });

    it('should fail to endorse a high value token with a low value key', async () => {
        const keys = Crypto.generateKeys();

        await member1.subscribeToNotifications("0F7BF07748A12DE0C2393FD3731BFEB1484693DFA47A5C9614428BDF724548CD");
        await member1.approveKey(Crypto.strKey(keys.publicKey), KeyLevel.LOW);
        const memberNew = await Token.loginWithUsername(keys, username1);
        const token = await memberNew.createToken(account1.id, 900.24, defaultCurrency, username2);
        const res = await memberNew.endorseToken(token.id);
        assert.equal(res.status, TokenOperationResult.Status.MORE_SIGNATURES_NEEDED);
    });
});
