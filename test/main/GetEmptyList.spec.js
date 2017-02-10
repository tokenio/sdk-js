const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';

describe('Empty tokens and accounts', () => {
    before(async () => {
        username1 = Crypto.generateKeys().keyId;
        member1 = await Token.createMember(username1);
    });

    it('should see an empty list of accounts', async () => {
        const accounts = await member1.getAccounts();
        assert.equal(accounts.length, 0);
    });

    it('should see an empty list of transfer tokens', async () => {
        const tokens = await member1.getTransferTokens(0, 100);
        assert.equal(tokens.data.length, 0);
    });

    it('should see an empty list of access', async () => {
        const tokens = await member1.getAccessTokens(0, 100);
        assert.equal(tokens.data.length, 0);
    });

    it('should see an empty list of subscribers', async () => {
        const subscribers = await member1.getSubscribers();
        assert.equal(subscribers.length, 0);
    });

    it('should see an empty list of addresses', async () => {
        const addresses = await member1.getAddresses();
        assert.equal(addresses.length, 0);
    });
});
