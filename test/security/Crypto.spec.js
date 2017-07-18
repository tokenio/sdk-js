const chai = require('chai');
const assert = chai.assert;
import Crypto from "../../src/security/Crypto";

describe('Key management', () => {
    it('should generate a key', () => {
        for (var i = 0; i < 10; i++) {
            const keys = Crypto.generateKeys('STANDARD');

            assert.isOk(keys);
            assert.isString(keys.id);
            assert.equal(keys.id.length, 16);
            assert.equal(keys.publicKey.length, 32);
            assert.equal(keys.secretKey.length, 64);
            assert.isOk(keys.algorithm);
            assert.isOk(keys.level);
        }
    });

    it('should sign a message', () => {
        for (var i = 0; i < 10; i++) {
            const keys = Crypto.generateKeys();
            const sig = Crypto.sign('abc', keys);
            assert.isAtLeast(sig.length, 50);
        }
    });

    it('should verify a message', () => {
        for (var i = 0; i < 10; i++) {
            const keys = Crypto.generateKeys('LOW');
            const sig = Crypto.sign('abc', keys);
            Crypto.verify('abc', sig, keys.publicKey);

            try {
                Crypto.verify('abcd', sig, keys.publicKey);
                return Promise.reject('Should fail');
            } catch (e) {
                return true;
            }
        }
    });

    it('should sign and verify json', () => {
        for (var i = 0; i < 10; i++) {
            const keys = Crypto.generateKeys('LOW');
            const json = {
                abc: 123,
                def: 'a string',
                obj: {
                    an: 'object',
                }
            };
            const sig = Crypto.signJson(json, keys);
            Crypto.verifyJson(json, sig, keys.publicKey);

            try {
                Crypto.verifyJson({bad: 'json'}, sig, keys.publicKey);
                return Promise.reject('Should fail');
            } catch (e) {
                return true;
            }
        }
    });

    it('should convert to and from string', () => {
        const keys = Crypto.generateKeys();
        const keyStr = Crypto.strKey(keys.publicKey);
        assert.isAtLeast(keyStr.length, 5);
        const keyBuffer = Crypto.bufferKey(keyStr);
        assert.equal(keys.publicKey[10], keyBuffer[10]);
    });
});
