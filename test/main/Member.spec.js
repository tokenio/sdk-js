const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member = {};
let username = '';

describe('member tests', () => {
    before(() => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        return Token.createMember(username)
            .then(res => {
                member = res;
                return member.approveKey(Crypto.strKey(keys.publicKey));
            });
    });

    describe('Creating a member', () => {
        it('should add a second key', () => {
            const keys = Crypto.generateKeys();
            return member.approveKey(Crypto.strKey(keys.publicKey));
        });

        it('should add and remove a key', () => {
            const keys = Crypto.generateKeys();
            return member.approveKey(Crypto.strKey(keys.publicKey))
                .then(() => member.removeKey(keys.keyId))
                .then(() => member.getPublicKeys())
                .then(keys => assert.isAtLeast(keys.length, 2));
        });

        it('should add an username', () => {
            const username = Crypto.generateKeys().keyId;
            return member.addUsername(username)
                .then(() => member.getAllUsernames())
                .then(usernames => assert.isAtLeast(usernames.length, 2));
        });

        it('should add and remove an username', () => {
            const newUsername = Crypto.generateKeys().keyId;
            return member.addUsername(newUsername)
                .then(() => member.removeUsername(newUsername))
                .then(() => member.getAllUsernames())
                .then(usernames => {
                    assert.include(usernames, username);
                    assert.notInclude(usernames, newUsername);
                });
        });

        it('should get all usernames', () => {
            return member.getAllUsernames().then(usernames => {
                assert.isAtLeast(usernames.length, 1);
            });
        });

        it('should get all keys', () => {
            return member.getPublicKeys().then(keys => {
                assert.isAtLeast(keys.length, 1);
            });
        });

        it('should link an account', () => {
            BankClient.requestLinkAccounts(username, 100000, 'EUR').then(alp =>
                member.linkAccounts('bank-id', alp).then(accs => {
                    assert.isAtLeast(accs.length, 2);
                })
            );
        });

        it('should get accounts', () => {
            BankClient.requestLinkAccounts(username, 100000, 'EUR').then(alp =>
                member.linkAccounts('bank-id', alp).then(() => {
                    return member.getAccounts().then(accs => {
                        assert.isAtLeast(accs.length, 2);
                    });
                })
            );
        });
    });
});
