import TestUtil from '../../TestUtil';
import MemoryKeyStore from '../../../../core/src/security/engines/MemoryKeyStore';
import UnsecuredFileKeyStore from '../../../src/security/engines/UnsecuredFileKeyStore';
import Crypto from '../../../../core/src/security/Crypto';
import Util from '../../../src/Util';
const {assert} = require('chai');
const path = require('path');
const fs = require('fs-extra');
const testDir = path.join(__dirname, 'testDir');

UnsecuredFileKeyStore.setDirRoot(testDir);

const keyStores = [MemoryKeyStore, UnsecuredFileKeyStore];

describe('Key store', () => {
    before('should clean up the test directory', async () => {
        await fs.remove(testDir);
        const dirExists = await fs.exists(testDir);
        assert(!dirExists);
    });

    after('should clean up the test directory', async () => {
        await fs.remove(testDir);
        const dirExists = await fs.exists(testDir);
        assert(!dirExists);
    });

    keyStores.forEach(KeyStore => {
        it('should create the keyStore and generate keys', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const keyPairStandard = await Crypto.generateKeys('STANDARD');
            const keyPairPrivileged = await Crypto.generateKeys('PRIVILEGED');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);
        });

        it('should get keys by level, idempotent', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const keyPairStandard = await Crypto.generateKeys('STANDARD');
            const keyPairPrivileged = await Crypto.generateKeys('PRIVILEGED');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);
            await keyStore.put(memberId, keyPairPrivileged);
            await keyStore.put(memberId, keyPairPrivileged);

            const privilegedKey = await keyStore.getByLevel(memberId, 'PRIVILEGED');
            assert.deepEqual(privilegedKey, keyPairPrivileged);
        });

        it('should get keys by id, idempotent', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const keyPairStandard = await Crypto.generateKeys('STANDARD');
            const keyPairPrivileged = await Crypto.generateKeys('PRIVILEGED');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);

            const lowKey = await keyStore.getById(memberId, keyPairLow.id);
            assert.deepEqual(lowKey, keyPairLow);
        });

        it('should not return expired keys', async() => {
            const keyStore = new KeyStore();
            const keyPairExpired = await Crypto.generateKeys('STANDARD', 2000);
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairExpired);

            await TestUtil.waitUntil(async() => {
                try {
                    await keyStore.getById(memberId, keyPairExpired.id);
                    return Promise.reject('Should throw');
                } catch (error) {
                    // ignore
                }
                try {
                    await keyStore.getByLevel(memberId, 'STANDARD');
                    return Promise.reject('Should throw');
                } catch (error) {
                    // ignore
                }

                const keyPairValid = await Crypto.generateKeys('LOW', 86400000);
                await keyStore.put(memberId, keyPairValid);

                const returnedKey = await keyStore.getByLevel(memberId, 'LOW');
                assert.deepEqual(returnedKey, keyPairValid);
                const returnedKeys = await keyStore.listKeys(memberId);
                assert.sameDeepMembers(returnedKeys, [keyPairValid]);
            });
        });

        it('should replace keys', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);

            const keyPairLow2 = await Crypto.generateKeys('LOW');
            await keyStore.put(memberId, keyPairLow2);

            const lowKey = await keyStore.getByLevel(memberId, 'LOW');
            assert.deepEqual(lowKey, keyPairLow2);
            assert.notDeepEqual(lowKey, keyPairLow);
        });

        it('should list keys', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const keyPairStandard = await Crypto.generateKeys('STANDARD');
            const keyPairPrivileged = await Crypto.generateKeys('PRIVILEGED');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);

            const listedKeys = await keyStore.listKeys(memberId);
            assert.includeDeepMembers(listedKeys, [keyPairLow, keyPairStandard, keyPairPrivileged]);
        });

        it('should store multiple members', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const keyPairStandard = await Crypto.generateKeys('STANDARD');
            const keyPairPrivileged = await Crypto.generateKeys('PRIVILEGED');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);

            const keyPairLow2 = await Crypto.generateKeys('LOW');
            const keyPairStandard2 = await Crypto.generateKeys('STANDARD');
            const keyPairPrivileged2 = await Crypto.generateKeys('PRIVILEGED');
            const memberId2 = Util.generateNonce();
            await keyStore.put(memberId2, keyPairLow2);
            await keyStore.put(memberId2, keyPairStandard2);
            await keyStore.put(memberId2, keyPairPrivileged2);

            // get by Id
            const lowKey = await keyStore.getById(memberId, keyPairLow.id);
            assert.deepEqual(lowKey, keyPairLow);
            const lowKey2 = await keyStore.getById(memberId2, keyPairLow2.id);
            assert.deepEqual(lowKey2, keyPairLow2);

            // get by level
            const privilegedKey = await keyStore.getByLevel(memberId, 'PRIVILEGED');
            assert.deepEqual(privilegedKey, keyPairPrivileged);
            const privilegedKey2 = await keyStore.getByLevel(memberId2, 'PRIVILEGED');
            assert.deepEqual(privilegedKey2, keyPairPrivileged2);

            // list keys
            const listedKeys = await keyStore.listKeys(memberId);
            assert.includeDeepMembers(listedKeys, [keyPairLow, keyPairStandard, keyPairPrivileged]);
            const listedKeys2 = await keyStore.listKeys(memberId2);
            assert.includeDeepMembers(
                listedKeys2,
                [keyPairLow2, keyPairStandard2, keyPairPrivileged2]);
        });

        it('should set and get active member Id (if defined)', async () => {
            if (!KeyStore.setActiveMemberId) {
                return;
            }
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);

            assert.equal(KeyStore.getActiveMemberId(), memberId);
            const keyPairLow2 = await Crypto.generateKeys('LOW');
            const memberId2 = Util.generateNonce();
            await keyStore.put(memberId2, keyPairLow2);

            assert.equal(KeyStore.getActiveMemberId(), memberId2);

            await KeyStore.setActiveMemberId(memberId);

            assert.equal(await KeyStore.getActiveMemberId(), memberId);
        });

        it('should fail to put, if no memberId or key', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = await Crypto.generateKeys('LOW');
            const memberId = Util.generateNonce();

            try {
                await keyStore.put(undefined, keyPairLow);
                return Promise.reject('Should throw');
            } catch (error) {
                // ignore
            }
            try {
                await keyStore.put(memberId, undefined);
                return Promise.reject('Should throw');
            } catch (error) {
                // ignore
            }
        });
    });
});
