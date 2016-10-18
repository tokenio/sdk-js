const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import KeyLevel from "../../src/main/KeyLevel";

let member = {};
let username = '';
describe('Key levels', () => {
    before(() => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        return Token
            .createMember(username)
            .then(res => {
                member = res;
                return member.approveKey(Crypto.strKey(keys.publicKey));
            });
    });

    it('should approve a standard level key', () => {
        const keys = Crypto.generateKeys();
        return member.approveKey(Crypto.strKey(keys.publicKey), KeyLevel.STANDARD).then(() => {
            return Token
                .loginWithUsername(keys, username)
                .then(memberNew => {
                    assert.equal(member.id, memberNew.id);
                });
        });
    });

    it('should approve a low level key', () => {
        const keys = Crypto.generateKeys();
        return member.approveKey(Crypto.strKey(keys.publicKey), KeyLevel.LOW).then(() => {
            return Token
                .loginWithUsername(keys, username)
                .then(memberNew => {
                    assert.equal(member.id, memberNew.id);
                });
        });
    });

    it('should not allow non-privileged key to add a key', done => {
        const keys = Crypto.generateKeys();
        member.approveKey(Crypto.strKey(keys.publicKey), KeyLevel.STANDARD).then(() => {
            return Token
                .loginWithUsername(keys, username)
                .then(memberNew => {
                    const keys2 = Crypto.generateKeys();
                    return memberNew.approveKey(Crypto.strKey(keys2.publicKey), KeyLevel.LOW).then(() => {
                        done(new Error("should fail"));
                    });
            });
        }).catch(() => done());
    });

    it('should not allow non-privileged key to add a key, LOW', done => {
        const keys = Crypto.generateKeys();
        member.approveKey(Crypto.strKey(keys.publicKey), KeyLevel.LOW).then(() => {
            return Token
                .loginWithUsername(keys, username)
                .then(memberNew => {
                    const keys2 = Crypto.generateKeys();
                    return memberNew.approveKey(Crypto.strKey(keys2.publicKey), KeyLevel.LOW).then(() => {
                        done(new Error("should fail"));
                    });
                });
        }).catch(() => done());
    });
});
