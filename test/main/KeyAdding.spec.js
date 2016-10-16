const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/Crypto";

let member = {};
let alias = '';

describe('Key addition detection', () => {

    beforeEach(() => {
        const keys = Crypto.generateKeys();
        alias = Crypto.generateKeys().keyId;
        return Token
            .createMember(alias)
            .then(res => {
                member = res;
                return member.approveKey(Crypto.strKey(keys.publicKey));
            });
    });

    it('should not have access before being added', done => {
        const keys = Crypto.generateKeys();
        Token
            .loginWithAlias(keys, alias)
            .then(ignored => { done(new Error("should fail")); })
            .catch(() => done());
    });

    it('should have access after being added', () => {
        const keys = Crypto.generateKeys();
        return member
            .approveKey(Crypto.strKey(keys.publicKey))
            .then(() => {
                return Token.loginWithAlias(keys, alias);
            })
            .then(memberNew => {
                assert.equal(member.id, memberNew.id);
            });
    });
});
