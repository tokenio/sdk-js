const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";

let member1 = {};
let username1 = '';

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.LocalStorageCryptoEngine);
};

describe('Saving and loading Members', () => {
    before(() => Promise.all([setUp1()]));

    it('save and login from LocalStorage, with or without memberId', async () => {
        if (BROWSER) {
            const member = Token.loginFromLocalStorage(member1.memberId());
            const publicKeys = await member.keys();
            assert.isAtLeast(publicKeys.length, 1);

            const member2 = Token.loginFromLocalStorage();
            const publicKeys2 = await member2.keys();
            assert.isAtLeast(publicKeys2.length, 1);
        }
    });

    it('save and login keys', async () => {
        const keys = await member1.keys()[0];
        const memberId = member1.memberId();

        const member2 = await Token.login(memberId, keys);
        const publicKeys = await member2.keys();
        assert.isAtLeast(publicKeys.length, 1);
    });
});
