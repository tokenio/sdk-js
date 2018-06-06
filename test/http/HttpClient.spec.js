const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

import HttpClient from "../../src/http/HttpClient";
import MemoryCryptoEngine from "../../src/security/engines/MemoryCryptoEngine";

const devKey = require("../../src/config.json").devKey[TEST_ENV];

describe('Unauthenticated', () => {
    it('should generate a memberId', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV, devKey);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
    });

    it('should add a key', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV, devKey);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = await engine.generateKey('PRIVILEGED');
        const res2 = await unauthenticatedClient.approveFirstKey(
            res.data.memberId,
            pk1,
            engine);

        assert.isOk(res2.data.member);
        assert.isOk(res2.data.member.lastHash);
        assert.equal(res2.data.member.keys.length, 1);
    });

    it('should call global handler on version mismatch error', async () => {
        let handlerCalled = false;
        const unauthenticatedClient = new HttpClient(TEST_ENV, devKey, (error) => {
            assert.equal(error.name, BROWSER ? 'UNKNOWN' : 'unsupported-client-version');
            handlerCalled = true;
        });
        // Override sdk version to force version mismatch error.
        unauthenticatedClient._instance.interceptors.request.eject(0);
        unauthenticatedClient._instance.interceptors.request.use((config) => {
            config.headers['token-sdk'] = 'js';
            config.headers['token-sdk-version'] = "0.0.1";
            return config;
        });
        try {
            await unauthenticatedClient.createMemberId();
            Promise.reject(new Error("should fail"));
        } catch (err) {
            assert.include(err.message, 'SDK');
        }
        assert.isTrue(handlerCalled);
    });

    it('should get a member', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV, devKey);
        const res = await unauthenticatedClient.createMemberId();
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = await engine.generateKey('PRIVILEGED');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('LOW');
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        assert.isOk(res2.data.member);
        const res3 = await unauthenticatedClient.getMember(res.data.memberId);
        assert.isOk(res3.data.member);
        assert.isOk(res3.data.member.lastHash);
        assert.equal(res3.data.member.keys.length, 3);
    });
});
