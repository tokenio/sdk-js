/* eslint-disable no-unused-vars*/
import FileSystem from "../../../src/security/PromiseFileSystem";

const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';
import UnsecuredFileCryptoEngine from "../../../src/security/engines/UnsecuredFileCryptoEngine";
const TokenIo = require('../../../src/index');
const devKey = require("../../../src/config.json").devKey[TEST_ENV];

let fs;
let path;
let testDir;

if (!BROWSER) {
    fs = require('fs-extra');
    path = require('path');

    // Goes back four dirs to find project base. Does this in order to create the testing dir
    // in the right place. Assumes process argv[1] is mocha binary
    testDir = path.join(path.join(
        path.dirname(path.dirname(path.dirname(path.dirname(process.argv[1])))),
        'test'), 'testDir');
}
const Token = new TokenIo(TEST_ENV, devKey, testDir);

describe('Unsecured File crypto engine', () => {
    if (!BROWSER) {
        before('Should clean up the test directory', async () => {
            await fs.remove(testDir);
            const dirExists = await fs.exists(testDir);
            assert(!dirExists);
            UnsecuredFileCryptoEngine.setDirRoot(testDir);
        });

        after('Should clean up the test directory', async () => {
            await fs.remove(testDir);
            const dirExists = await fs.exists(testDir);
            assert(!dirExists);
        });

        it('should create the file crypto engine', () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            assert.isOk(engine);
        });

        it('should generate keys', async () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
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
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            await engine.generateKey('LOW');
            try {
                await engine.createSigner('STANDARD');
                return Promise.reject(new Error("should fail"));
            } catch (err) {
                assert.include(err.message, "No key");
            }
        });

        it('should have a signer with a key id', async () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            const pk1 = await engine.generateKey('LOW');
            const signerLow = await engine.createSigner('LOW');
            assert.equal(signerLow.getKeyId(), pk1.id);
        });

        it('should sign and verify', async () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            const pk1 = await engine.generateKey('LOW');
            const signer = await engine.createSigner('LOW');
            const verifier = await engine.createVerifier(pk1.id);
            const sig = await signer.sign('abcdefg');
            await verifier.verify('abcdefg', sig);
        });

        it('should sign and verify json', async () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            const pk1 = await engine.generateKey('LOW');
            const signer = await engine.createSigner('LOW');
            const verifier = await engine.createVerifier(pk1.id);
            const sig = await signer.signJson({a: 5, c: 14, b: -512});
            await verifier.verifyJson({a: 5, c: 14, b: -512}, sig);
        });

        it('should fail to verify an invalid signature', async () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            const pk1 = await engine.generateKey('LOW');
            const signer = await engine.createSigner('LOW');
            const verifier = await engine.createVerifier(pk1.id);
            const sig = await signer.sign('abcdefg');
            try {
                await verifier.verify('bcdefg', sig);
                return Promise.reject(new Error("should fail"));
            } catch (err) {
                assert.include(err.message, "Invalid signature");
            }
        });

        it('should be able to create multiple engines', async () => {
            const memberId = Token.Util.generateNonce();
            const engine = new UnsecuredFileCryptoEngine(memberId);
            await engine.generateKey('LOW');
            const engine2 = new UnsecuredFileCryptoEngine(memberId);
            const pk2 = await engine2.generateKey('STANDARD');
            const signer = await engine.createSigner('STANDARD');
            const verifier = await engine2.createVerifier(pk2.id);
            const sig = await signer.sign('abcdefg');
            await verifier.verify('abcdefg', sig);
        });

        it('should save, load, sign and verify', async () => {
            const newMemberId = Token.Util.generateNonce();
            const fileContents = JSON.stringify({
                keys: [{
                    id: 'cRTcrcksAVtOC96h',
                    level: 'LOW',
                    algorithm: 'ED25519',
                    publicKey: 'b8uKAhTT_55wL1QCBaDLtclfeXOEf5Gm8qYY7KbghCo',
                    privateKey: 'YLYhbPCsfJtKt5wvT69ocAwjTCaX8goEFgDIzS-zRD1vy4oCFNP_' +
                    'nnAvVAIFoMu1yV95c4R_kabyphjspuCEKg'
                }]
            });

            await FileSystem.writeFile(newMemberId, fileContents);

            const engine = new UnsecuredFileCryptoEngine(newMemberId);
            const signer = await engine.createSigner('LOW');
            const verifier = await engine.createVerifier('cRTcrcksAVtOC96h');
            const sig = await signer.sign('string to sign');
            await verifier.verify('string to sign', sig);
        });

        it('should be able to login a member', async () => {
            const alias = Token.Util.randomAlias();
            const member =
                await Token.createMember(alias, UnsecuredFileCryptoEngine);
            const memberId = member.memberId();
            const bankAuth = await member.createTestBankAccount('1001', 'EUR');
            const accounts = await member.linkAccounts(bankAuth);

            const memberLoggedIn = await Token.getMember(UnsecuredFileCryptoEngine, memberId);
            const bankAccounts = await memberLoggedIn.getAccounts();

            assert.isAtLeast(bankAccounts.length, 1);
            assert.equal(bankAccounts.length, accounts.length);
            assert.deepEqual(bankAccounts, accounts);
        });

        it('should fail to load bad JSON', async () => {
            const newMemberId = Token.Util.generateNonce();
            const fileContents = "{13-+23e. /:::}";
            await FileSystem.writeFile(newMemberId, fileContents);

            const engine = new UnsecuredFileCryptoEngine(newMemberId);
            try {
                const signer = await engine.createSigner('LOW');
                return Promise.reject(new Error("should fail"));
            } catch (err) {
                // Fails as expeceted
            }
        });
    }
});
