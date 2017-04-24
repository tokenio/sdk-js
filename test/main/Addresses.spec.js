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


describe('Addresses', () => {
    beforeEach(async () => {
        username1 = Token.Util.generateNonce();
        member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
        const auth = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const accs = await member1.linkAccounts(auth);
        account1 = accs[0];
    });

    it('Add and lookup an address', async () => {
        const address = { city: 'San Francisco', country: 'US' };
        await member1.addAddress("Home", address);
        const res = await member1.getAddresses();
        assert.equal(res.length, 1);
        assert.equal(res[0].name, "Home");
        assert.deepEqual(res[0].address, address);
        assert.isOk(res[0].addressSignature);
        assert.isOk(res[0].id);
    });
});
