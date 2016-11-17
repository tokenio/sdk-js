const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";

let member1 = {};
let username1 = '';

// Set up a first member
const setUp1 = async () => {
    username1 = Crypto.generateKeys().keyId;
    member1 = await Token.createMember(username1);
};

describe('Saving and loading Members', () => {
    before(() => Promise.all([setUp1()]));

    it('save and login from LocalStorage', async () => {
        if (BROWSER) {
            await member1.saveToLocalStorage();
            const member = await Token.loginFromLocalStorage();
            const publicKeys = await member.getPublicKeys();
            assert.isAtLeast(publicKeys.length, 1);
        }
    });

    it('save and login keys', async () => {
        const keys = member1.keys;
        const memberId = member1.id;

        const member2 = await Token.login(memberId, keys);
        const publicKeys = await member2.getPublicKeys();
        assert.isAtLeast(publicKeys.length, 1);
    });
});
