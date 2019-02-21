import MemoryCryptoEngine from '../../../../core/src/security/engines/MemoryCryptoEngine';
import Util from '../../../src/Util';
const {assert} = require('chai');

describe('Memory crypto engines', () => {
    it('should create the memory crypto engines', () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        assert.isOk(engine);
    });

    it('should generate keys', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('PRIVILEGED');
        const pk4 = await engine.generateKey('PRIVILEGED');
        assert.isOk(pk1);
        assert.isOk(pk2);
        assert.isOk(pk3);
        assert.isOk(pk4);
    });

    it('should not create a bad signer', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        await engine.generateKey('LOW');
        try {
            await engine.createSigner('STANDARD');
            return Promise.reject(new Error('should fail'));
        } catch (err) {
            assert.include(err.message, 'No key');
        }
    });

    it('should have a signer with a key id', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const signerLow = await engine.createSigner('LOW');
        assert.equal(signerLow.getKeyId(), pk1.id);
    });

    it('should sign and verify', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const signer = await engine.createSigner('LOW');
        const verifier = await engine.createVerifier(pk1.id);
        const sig = await signer.sign('abcdefg');
        await verifier.verify('abcdefg', sig);
    });

    it('should sign and verify json', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const signer = await engine.createSigner('LOW');
        const verifier = await engine.createVerifier(pk1.id);
        const sig = await signer.signJson({a: 5, c: 14, b: -512});
        await verifier.verifyJson({a: 5, c: 14, b: -512}, sig);
    });

    it('should fail to verify an invalid signature', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const signer = await engine.createSigner('LOW');
        const verifier = await engine.createVerifier(pk1.id);
        const sig = await signer.sign('abcdefg');
        try {
            await verifier.verify('bcdefg', sig);
            return Promise.reject(new Error('should fail'));
        } catch (err) {
            assert.include(err.message, 'Invalid signature');
        }
    });

    it('should be able to create multiple engines', async () => {
        const memberId = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        await engine.generateKey('LOW');
        const engine2 = new MemoryCryptoEngine(memberId);
        const pk2 = await engine2.generateKey('STANDARD');
        const signer = await engine.createSigner('STANDARD');
        const verifier = await engine2.createVerifier(pk2.id);
        const sig = await signer.sign('abcdefg');
        await verifier.verify('abcdefg', sig);
    });

    it('should be able to log in with the active memberId', async () => {
        const memberId = Util.generateNonce();
        const memberId2 = Util.generateNonce();
        const memberId3 = Util.generateNonce();
        const engine = new MemoryCryptoEngine(memberId);
        const engine2 = new MemoryCryptoEngine(memberId2);
        const engine3 = new MemoryCryptoEngine(memberId3);
        await engine.generateKey('LOW');
        await engine2.generateKey('LOW');
        const pk3 = await engine3.generateKey('LOW');

        const engineNew = new MemoryCryptoEngine(
            MemoryCryptoEngine.getActiveMemberId());
        const signer = await engineNew.createSigner('LOW');
        const verifier = await engineNew.createVerifier(pk3.id);
        const sig = await signer.sign('abcdefg');
        await verifier.verify('abcdefg', sig);
    });

    it('should fail to log in to an empty browser', async () => {
        try {
            const engine = new MemoryCryptoEngine();
            return Promise.reject(new Error('should fail to log in', engine));
        } catch (err) {
            assert.include(err.message, 'Invalid memberId');
        }
    });
});
