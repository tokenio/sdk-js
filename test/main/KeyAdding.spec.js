const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/security/Crypto";

let member = {};
let username = '';

describe('Key addition detection', () => {

    beforeEach(async () => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        member = await Token.createMember(username);
        await member.approveKey(keys);
    });

    it('should not have access before being added', async () => {
        const keys = Crypto.generateKeys();
        try {
            await Token.loginWithUsername(keys, username);
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            return;
        }
    });

    it('should have access after being added', async () => {
        const keys = Crypto.generateKeys();
        await member.approveKey(keys);
        const memberNew = await Token.loginWithUsername(keys, username);
        assert.equal(member.id, memberNew.id);
    });
});
