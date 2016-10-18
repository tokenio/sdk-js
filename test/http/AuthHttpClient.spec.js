const chai = require('chai');
const assert = chai.assert;

import HttpClient from "../../src/http/HttpClient";
import AuthHttpClient from "../../src/http/AuthHttpClient";
import Crypto from "../../src/Crypto";
import KeyLevel from "../../src/main/KeyLevel";

describe('AuthHttpClient', () => {
    it('should add a second key', () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const keys2 = Crypto.generateKeys();
        return unauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return unauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
                        client
                            .addKey(res2.data.member.lastHash, keys2.publicKey, KeyLevel.PRIVILEGED, [])
                            .then(res3 => {
                                assert.isOk(res3.data.member);
                                assert.isOk(res3.data.member.lastHash);
                                assert.equal(res3.data.member.keys.length, 2);
                                return true;
                            })
                    });
            });
    });

    it('should remove a key', () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        const keys2 = Crypto.generateKeys();
        return unauthenticatedClient.createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return unauthenticatedClient.addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
                        client
                            .addKey(res2.data.member.lastHash, keys2.publicKey, KeyLevel.PRIVILEGED, [])
                            .then(res3 => {
                                assert.equal(res3.data.member.keys.length, 2);
                                return client.removeKey(res3.data.member.lastHash, keys2.keyId);
                            })
                    });
            });
    });

    it('should add usernames', () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        return unauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return unauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
                        client.addUsername(res2.data.member.lastHash, Crypto.generateKeys().keyId)
                            .then(res3 => {
                                assert.equal(res3.data.member.usernames.length, 1);
                                return client
                                    .addUsername(res3.data.member.lastHash, Crypto.generateKeys().keyId)
                                    .then(res4 => {
                                        assert.equal(res4.data.member.usernames.length, 2);
                                    });
                            })
                    });
            });
    });

    it('should remove usernames', () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        return unauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return unauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(TEST_ENV, res.data.memberId, keys);
                        client
                            .addUsername(res2.data.member.lastHash, Crypto.generateKeys().keyId)
                            .then(res3 => {
                                assert.equal(res3.data.member.usernames.length, 1);
                                const secondUsername = Crypto.generateKeys().keyId;
                                return client
                                    .addUsername(res3.data.member.lastHash, secondUsername)
                                    .then(res4 => {
                                        assert.equal(res4.data.member.usernames.length, 2);
                                        return client
                                            .removeUsername(res4.data.member.lastHash, secondUsername)
                                            .then(res5 => {
                                                assert.equal(res5.data.member.usernames.length, 1);
                                            });
                                    });
                            })
                    });
            });
    });

    it('should get a member', () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const keys = Crypto.generateKeys();
        return unauthenticatedClient.createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return unauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 =>
                        new AuthHttpClient(TEST_ENV, res.data.memberId, keys)
                        .getMember(res.data.memberId)
                        .then(res3 => {
                            assert.isOk(res3.data.member);
                            assert.isOk(res3.data.member.lastHash);
                            assert.equal(res3.data.member.keys.length, 1);
                        })
                    );
            });
    });
});
