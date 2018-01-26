const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const assert = chai.assert;
import 'babel-regenerator-runtime';
import BrowserKeyStore from "../../../src/security/engines/BrowserKeyStore";
import MemoryKeyStore from "../../../src/security/engines/MemoryKeyStore";
import Crypto from "../../../src/security/Crypto";
import Util from '../../../src/Util';

var keyStores = [MemoryKeyStore, BrowserKeyStore];
if (!BROWSER) {
    keyStores = [MemoryKeyStore]; // TODO += FS
}

describe('Key store', () => {
    keyStores.forEach((KeyStore) => {
        it('should create the keyStore and generate keys', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const keyPairStandard = Crypto.generateKeys("STANDARD");
            const keyPairPrivileged = Crypto.generateKeys("PRIVILEGED");
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);
        });

        it('should get keys by level, idempotent', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const keyPairStandard = Crypto.generateKeys("STANDARD");
            const keyPairPrivileged = Crypto.generateKeys("PRIVILEGED");
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);
            await keyStore.put(memberId, keyPairPrivileged);
            await keyStore.put(memberId, keyPairPrivileged);

            const privilegedKey = await keyStore.getByLevel(memberId, "PRIVILEGED");
            assert.deepEqual(privilegedKey, keyPairPrivileged);
        });

        it('should get keys by id, idempotent', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const keyPairStandard = Crypto.generateKeys("STANDARD");
            const keyPairPrivileged = Crypto.generateKeys("PRIVILEGED");
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);

            const lowKey = await keyStore.getById(memberId, keyPairLow.id);
            assert.deepEqual(lowKey, keyPairLow);
        });

        it('should replace keys', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);

            const keyPairLow2 = Crypto.generateKeys("LOW");
            await keyStore.put(memberId, keyPairLow2);

            const lowKey = await keyStore.getByLevel(memberId, "LOW");
            assert.deepEqual(lowKey, keyPairLow2);
            assert.notDeepEqual(lowKey, keyPairLow);
        });

        it('should list keys', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const keyPairStandard = Crypto.generateKeys("STANDARD");
            const keyPairPrivileged = Crypto.generateKeys("PRIVILEGED");
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
            const keyPairLow = Crypto.generateKeys("LOW");
            const keyPairStandard = Crypto.generateKeys("STANDARD");
            const keyPairPrivileged = Crypto.generateKeys("PRIVILEGED");
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);
            await keyStore.put(memberId, keyPairStandard);
            await keyStore.put(memberId, keyPairPrivileged);

            const keyPairLow2 = Crypto.generateKeys("LOW");
            const keyPairStandard2 = Crypto.generateKeys("STANDARD");
            const keyPairPrivileged2 = Crypto.generateKeys("PRIVILEGED");
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
            const privilegedKey = await keyStore.getByLevel(memberId, "PRIVILEGED");
            assert.deepEqual(privilegedKey, keyPairPrivileged);
            const privilegedKey2 = await keyStore.getByLevel(memberId2, "PRIVILEGED");
            assert.deepEqual(privilegedKey2, keyPairPrivileged2);

            // list keys
            const listedKeys = await keyStore.listKeys(memberId);
            assert.includeDeepMembers(listedKeys, [keyPairLow, keyPairStandard, keyPairPrivileged]);
            const listedKeys2 = await keyStore.listKeys(memberId2);
            assert.includeDeepMembers(
                listedKeys2,
                [keyPairLow2, keyPairStandard2, keyPairPrivileged2]);
        });

        it('should set and get active memeber Id', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const memberId = Util.generateNonce();
            await keyStore.put(memberId, keyPairLow);

            assert.equal(KeyStore.getActiveMemberId(), memberId);
            const keyPairLow2 = Crypto.generateKeys("LOW");
            const memberId2 = Util.generateNonce();
            await keyStore.put(memberId2, keyPairLow2);

            assert.equal(KeyStore.getActiveMemberId(), memberId2);

            KeyStore.setActiveMemberId(memberId);

            assert.equal(KeyStore.getActiveMemberId(), memberId);
        });

        it('should fail to put, if no memberId or key', async () => {
            const keyStore = new KeyStore();
            const keyPairLow = Crypto.generateKeys("LOW");
            const memberId = Util.generateNonce();

            try {
                await keyStore.put(undefined, keyPairLow);
                return Promise.reject("Should throw");
            } catch (error) {}
            try {
                await keyStore.put(memberId, undefined);
                return Promise.reject("Should throw");
            } catch (error) {}
        });
    });
});