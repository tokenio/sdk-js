const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import {KeyLevel} from '../../src/constants';

let member = {};
let username = '';
describe('Key levels', () => {
    before(async () => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        member = await Token.createMember(username);
        await member.approveKey(keys);
    });

    it('should approve a standard level key', async () => {
        const keys = Crypto.generateKeys();
        await member.approveKey(keys, KeyLevel.STANDARD);
        const memberNew = await Token.loginWithUsername(keys, username);
        assert.equal(member.id, memberNew.id);
    });

    it('should approve a low level key', async () => {
        const keys = Crypto.generateKeys();
        await member.approveKey(keys, KeyLevel.LOW);
        const memberNew = await Token.loginWithUsername(keys, username);
        assert.equal(member.id, memberNew.id);
    });

    it('should not allow non-privileged key to add a key', async () => {
        const keys = Crypto.generateKeys();
        await member.approveKey(keys, KeyLevel.STANDARD);
        const memberNew = await Token.loginWithUsername(keys, username);
        const keys2 = Crypto.generateKeys();
        try {
            await memberNew.approveKey(keys2, KeyLevel.LOW);
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            return true;
        }
    });

    it('should not allow non-privileged key to add a key, LOW', async () => {
        const keys = Crypto.generateKeys();
        await member.approveKey(keys, KeyLevel.LOW);
        const memberNew = await Token.loginWithUsername(keys, username);
        const keys2 = Crypto.generateKeys();
        try {
            await memberNew.approveKey(keys2, KeyLevel.LOW);
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            return true;
        }
    });
});
