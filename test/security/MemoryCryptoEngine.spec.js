const chai = require('chai');
const assert = chai.assert;
import MemoryCryptoEngine from "../../src/security/MemoryCryptoEngine";
const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

if (BROWSER) {
    describe('Memory crypto engine', () => {
        it('should create the memory crypto engine', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            assert.isOk(engine);
        });

        it('should generate keys', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            const pk1 = engine.generateKey('LOW');
            const pk2 = engine.generateKey('STANDARD');
            const pk3 = engine.generateKey('PRIVILEGED');
            const pk4 = engine.generateKey('PRIVILEGED');
            assert.isOk(pk1);
            assert.isOk(pk2);
            assert.isOk(pk3);
            assert.isOk(pk4);
        });

        it('should not create a bad signer', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            engine.generateKey('LOW');
            try {
                engine.createSigner('STANDARD');
                return Promise.reject(new Error("should fail"));
            } catch (err) {
                assert.include(err.message, "No key");
            }
        });

        it('should have a signer with a key id', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            const pk1 = engine.generateKey('LOW');
            const signerLow = engine.createSigner('LOW');
            assert.equal(signerLow.getKeyId(), pk1.id);
        });

        it('should sign and verify', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            const pk1 = engine.generateKey('LOW');
            const signer = engine.createSigner('LOW');
            const verifier = engine.createVerifier(pk1.id);
            const sig = signer.sign('abcdefg');
            verifier.verify('abcdefg', sig);
        });

        it('should sign and verify json', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            const pk1 = engine.generateKey('LOW');
            const signer = engine.createSigner('LOW');
            const verifier = engine.createVerifier(pk1.id);
            const sig = signer.signJson({a: 5, c: 14, b: -512});
            verifier.verifyJson({a: 5, c: 14, b: -512}, sig);
        });

        it('should fail to verify an invalid signature', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            const pk1 = engine.generateKey('LOW');
            const signer = engine.createSigner('LOW');
            const verifier = engine.createVerifier(pk1.id);
            const sig = signer.sign('abcdefg');
            try {
                verifier.verify('bcdefg', sig);
                return Promise.reject(new Error("should fail"));
            } catch (err) {
                assert.include(err.message, "Invalid signature");
            }
        });

        it('should be able to create multiple engines', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            engine.generateKey('LOW');
            const engine2 = new MemoryCryptoEngine(memberId);
            const pk2 = engine2.generateKey('STANDARD');
            const signer = engine.createSigner('STANDARD');
            const verifier = engine2.createVerifier(pk2.id);
            const sig = signer.sign('abcdefg');
            verifier.verify('abcdefg', sig);
        });

        it('should be able to log in with the active memberId', () => {
            const memberId = Token.Util.generateNonce();
            const memberId2 = Token.Util.generateNonce();
            const memberId3 = Token.Util.generateNonce();
            const engine = new MemoryCryptoEngine(memberId);
            const engine2 = new MemoryCryptoEngine(memberId2);
            const engine3 = new MemoryCryptoEngine(memberId3);
            engine.generateKey('LOW');
            engine2.generateKey('LOW');
            const pk3 = engine3.generateKey('LOW');

            const engineNew = new MemoryCryptoEngine(
                MemoryCryptoEngine.getActiveMemberId());
            const signer = engineNew.createSigner('LOW');
            const verifier = engineNew.createVerifier(pk3.id);
            const sig = signer.sign('abcdefg');
            verifier.verify('abcdefg', sig);
        });

        it('should fail to log in to an empty browser', () => {
            try {
                const engine = new MemoryCryptoEngine();
                return Promise.reject(new Error("should fail to log in", engine));
            } catch (err) {
                assert.include(err.message, "Invalid memberId");
            }
        });
    });
}
