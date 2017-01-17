import chai from 'chai';
const assert = chai.assert;
import 'babel-regenerator-runtime';

import HttpClient from "../../src/http/HttpClient";
import AuthHttpClient from "../../src/http/AuthHttpClient";
import Crypto from "../../src/Crypto";
import {KeyLevel} from '../../src/constants';

describe('AuthHttpClient', () => {
    it('should add a second key', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const keys2 = Crypto.generateKeys();
        const res = await unauthenticatedClient.createMemberId();
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.addFirstKey(res.data.memberId, keys);
        const res3 = await client.addKey(res2.data.member.lastHash, keys2, KeyLevel.PRIVILEGED, []);
        assert.isOk(res3.data.member);
        assert.isOk(res3.data.member.lastHash);
        assert.equal(res3.data.member.keys.length, 2);
    });

    it('should remove a key', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const keys2 = Crypto.generateKeys();
        const res = await unauthenticatedClient.createMemberId();
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.addFirstKey(res.data.memberId, keys);
        const res3 = await client.addKey(res2.data.member.lastHash, keys2, KeyLevel.PRIVILEGED, [])
        assert.equal(res3.data.member.keys.length, 2);
        return await client.removeKey(res3.data.member.lastHash, keys2.keyId);
    });

    it('should add usernames', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const res = await unauthenticatedClient.createMemberId();
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.addFirstKey(res.data.memberId, keys);
        const res3 = await client.addUsername(res2.data.member.lastHash, Crypto.generateKeys().keyId);
        assert.equal(res3.data.member.usernames.length, 1);
        const res4 = await client.addUsername(res3.data.member.lastHash, Crypto.generateKeys().keyId)
        assert.equal(res4.data.member.usernames.length, 2);
    });

    it('should remove usernames', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
        const res2 = await unauthenticatedClient.addFirstKey(res.data.memberId, keys);
        const res3 = await client.addUsername(res2.data.member.lastHash, Crypto.generateKeys().keyId)
        assert.equal(res3.data.member.usernames.length, 1);
        const secondUsername = Crypto.generateKeys().keyId;
        const res4 = await client.addUsername(res3.data.member.lastHash, secondUsername);
        assert.equal(res4.data.member.usernames.length, 2);
        const res5 = await client.removeUsername(res4.data.member.lastHash, secondUsername)
        assert.equal(res5.data.member.usernames.length, 1);
    });

    it('should get a member', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const res = await unauthenticatedClient.createMemberId();
        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys)
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.addFirstKey(res.data.memberId, keys);
        const res3 = await client.getMember(res.data.memberId)
        assert.isOk(res3.data.member);
        assert.isOk(res3.data.member.lastHash);
        assert.equal(res3.data.member.keys.length, 1);
    });
});
