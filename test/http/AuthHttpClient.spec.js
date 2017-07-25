import chai from 'chai';
const assert = chai.assert;
import 'babel-regenerator-runtime';

import HttpClient from "../../src/http/HttpClient";
import AuthHttpClient from "../../src/http/AuthHttpClient";
import MemoryCryptoEngine from "../../src/security/engines/MemoryCryptoEngine";
const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

describe('AuthHttpClient', () => {
    it('should add a second key', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = engine.generateKey('PRIVILEGED');
        const pk2 = engine.generateKey('STANDARD');
        const pk3 = engine.generateKey('LOW');
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        assert.isOk(res2.data.member);
        assert.isOk(res2.data.member.lastHash);
        assert.equal(res2.data.member.keys.length, 3);
    });

    it('should remove a key', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = engine.generateKey('PRIVILEGED');
        const pk2 = engine.generateKey('STANDARD');
        const pk3 = engine.generateKey('LOW');
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, engine);
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        return await client.removeKey(res2.data.member.lastHash, pk2.id);
    });

    it('should add usernames', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = engine.generateKey('PRIVILEGED');
        const pk2 = engine.generateKey('STANDARD');
        const pk3 = engine.generateKey('LOW');
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, engine);
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        const res3 = await client.addUsername(
            res2.data.member.lastHash,
            Token.Util.generateNonce());
        assert.equal(res3.data.member.usernames.length, 1);
        const res4 = await client.addUsername(
          res3.data.member.lastHash, Token.Util.generateNonce());
        assert.equal(res4.data.member.usernames.length, 2);
    });

    it('should remove usernames', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = engine.generateKey('PRIVILEGED');
        const pk2 = engine.generateKey('STANDARD');
        const pk3 = engine.generateKey('LOW');
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, engine);
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        const res3 = await client.addUsername(
            res2.data.member.lastHash,
            Token.Util.generateNonce());
        assert.equal(res3.data.member.usernames.length, 1);
        const secondUsername = Token.Util.generateNonce();
        const res4 = await client.addUsername(res3.data.member.lastHash, secondUsername);
        assert.equal(res4.data.member.usernames.length, 2);
        const res5 = await client.removeUsername(res4.data.member.lastHash, secondUsername);
        assert.equal(res5.data.member.usernames.length, 1);
    });
});
