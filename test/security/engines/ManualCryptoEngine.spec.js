const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';
import ManualCryptoEngine from "../../../src/security/engines/ManualCryptoEngine";
import Util from '../../../src/Util';
import Crypto from '../../../src/security/Crypto';

describe('Manual crypto engines', () => {
    it('should create the manual crypto engines', () => {
        const memberId = Util.generateNonce();

        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        assert.isOk(engine);
    });

    it('should generate keys', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('PRIVILEGED');
        const pk4 = await engine.generateKey('PRIVILEGED');
        assert.isOk(pk1);
        assert.isOk(pk2);
        assert.isOk(pk3);
        assert.isOk(pk4);
    });

    it('should fail to log in to an empty browser', async () => {
        try {
            ManualCryptoEngine.setKeys([
                Crypto.generateKeys('LOW'),
                Crypto.generateKeys('STANDARD'),
                Crypto.generateKeys('PRIVILEGED'),
            ]);
            const engine = new ManualCryptoEngine();
            return Promise.reject(new Error("should fail to log in", engine));
        } catch (err) {
            assert.include(err.message, "Invalid memberId");
        }
    });
});
