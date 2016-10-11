const chai = require('chai');
const assert = chai.assert;

import UnauthenticatedClient from "../../src/http/UnauthenticatedClient";
import AuthHttpClient from "../../src/http/AuthHttpClient";
import Crypto from "../../src/Crypto";
import KeyLevel from "../../src/main/KeyLevel";

describe('AuthHttpClient', () => {
    it('should add a second key', () => {
        const keys = Crypto.generateKeys();
        const keys2 = Crypto.generateKeys();
        return UnauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return UnauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(res.data.memberId, keys);
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
        const keys = Crypto.generateKeys();
        const keys2 = Crypto.generateKeys();
        return UnauthenticatedClient.createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return UnauthenticatedClient.addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(res.data.memberId, keys);
                        client
                            .addKey(res2.data.member.lastHash, keys2.publicKey, KeyLevel.PRIVILEGED, [])
                            .then(res3 => {
                                assert.equal(res3.data.member.keys.length, 2);
                                return client.removeKey(res3.data.member.lastHash, keys2.keyId);
                            })
                    });
            });
    });

    it('should add aliases', () => {
        const keys = Crypto.generateKeys();
        return UnauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return UnauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(res.data.memberId, keys);
                        client.addAlias(res2.data.member.lastHash, Crypto.generateKeys().keyId)
                            .then(res3 => {
                                assert.equal(res3.data.member.aliases.length, 1);
                                return client
                                    .addAlias(res3.data.member.lastHash, Crypto.generateKeys().keyId)
                                    .then(res4 => {
                                        assert.equal(res4.data.member.aliases.length, 2);
                                    });
                            })
                    });
            });
    });

    it('should remove aliases', () => {
        const keys = Crypto.generateKeys();
        return UnauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return UnauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        const client = new AuthHttpClient(res.data.memberId, keys);
                        client
                            .addAlias(res2.data.member.lastHash, Crypto.generateKeys().keyId)
                            .then(res3 => {
                                assert.equal(res3.data.member.aliases.length, 1);
                                const secondAlias = Crypto.generateKeys().keyId;
                                return client
                                    .addAlias(res3.data.member.lastHash, secondAlias)
                                    .then(res4 => {
                                        assert.equal(res4.data.member.aliases.length, 2);
                                        return client
                                            .removeAlias(res4.data.member.lastHash, secondAlias)
                                            .then(res5 => {
                                                assert.equal(res5.data.member.aliases.length, 1);
                                            });
                                    });
                            })
                    });
            });
    });

    it('should get a member', () => {
        const keys = Crypto.generateKeys();
        return UnauthenticatedClient.createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return UnauthenticatedClient
                    .addFirstKey(keys, res.data.memberId)
                    .then(res2 => new AuthHttpClient(res.data.memberId, keys)
                        .getMember(res.data.memberId, keys)
                        .then(res3 => {
                            assert.isOk(res3.data.member);
                            assert.isOk(res3.data.member.lastHash);
                            assert.equal(res3.data.member.keys.length, 1);
                        })
                    );
            });
    });
});
