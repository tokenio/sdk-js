const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";

let member = {};
let alias = '';
describe('Key addition detection', () => {
    beforeEach(() => {
        const keys = Crypto.generateKeys();
        alias = Crypto.generateKeys().keyId;
        return Token.createMember(alias)
            .then(res => {
                member = res;
                return member.approveKey(Crypto.strKey(keys.publicKey));
            });
    });

    it('should not have access before being added', done => {
        const keys = Crypto.generateKeys();
        Token.getMember(keys, alias).then(member => {
            done(new Error("should fail"));
        })
            .catch(() => done());
    });
    it('should have access after being added', () => {
        const keys = Crypto.generateKeys();
        return member.approveKey(Crypto.strKey(keys.publicKey)).then(() => {
            return Token.getMember(keys, alias).then(memberNew => {
                assert.equal(member.id, memberNew.id);
            });
        });
    });
});
