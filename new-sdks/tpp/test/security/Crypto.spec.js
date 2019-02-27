import Crypto from '../../../core/src/security/Crypto';
import Util from '../../src/Util';
const {assert} = require('chai');

describe('Key management', () => {
    it('should generate a key', async () => {
        for (let i = 0; i < 10; i++) {
            const keys = await Crypto.generateKeys('STANDARD');

            assert.isOk(keys);
            assert.isString(keys.id);
            assert.equal(keys.id.length, 16);
            assert.isOk(keys.algorithm);
            assert.isOk(keys.level);
        }
    });

    it('should sign a message', async () => {
        for (let i = 0; i < 10; i++) {
            const keys = await Crypto.generateKeys('LOW');
            const sig = await Crypto.sign('abc', keys);
            assert.isAtLeast(sig.length, 50);
        }
    });

    it('should verify a message', async () => {
        for (let i = 0; i < 10; i++) {
            const keys = await Crypto.generateKeys('LOW');
            const sig = await Crypto.sign('abc', keys);
            await Crypto.verify('abc', sig, keys.publicKey);

            try {
                await Crypto.verify('abcd', sig, keys.publicKey);
                return Promise.reject('Should fail');
            } catch (e) {
                return true;
            }
        }
    });

    it('should sign and verify json', async () => {
        for (let i = 0; i < 10; i++) {
            const keys = await Crypto.generateKeys('LOW');
            const json = {
                abc: 123,
                def: 'a string',
                obj: {
                    an: 'object',
                },
            };
            const sig = await Crypto.signJson(json, keys);
            await Crypto.verifyJson(json, sig, keys.publicKey);

            try {
                await Crypto.verifyJson({bad: 'json'}, sig, keys.publicKey);
                return Promise.reject('Should fail');
            } catch (e) {
                return true;
            }
        }
    });

    it('should convert to and from string', async () => {
        const keys = await Crypto.generateKeys('LOW');
        const keyStr = Util.strKey(keys.publicKey);
        assert.isAtLeast(keyStr.length, 5);
        const keyBuffer = Util.bufferKey(keyStr);
        assert.equal(keys.publicKey[10], keyBuffer[10]);
    });
});
