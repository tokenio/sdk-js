const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member = {};
let alias = '';

describe('member tests', () => {
    beforeEach(() => {
        const keys = Crypto.generateKeys();
        alias = Crypto.generateKeys().keyId;
        return Token.createMember(alias)
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
                .then(keys => assert.equal(keys.length, 2));
        });

        it('should confirm alias does not exist', () => {
            return member.aliasExists(Crypto.generateKeys().keyId)
                .then(exists => assert.equal(exists, false));
        });

        it('should confirm alias exists', () => {
            const alias = Crypto.generateKeys().keyId;
            return member.addAlias(alias)
                .then(() => member.aliasExists(alias))
                .then(exists => assert.equal(exists, true));
        });

        it('should add an alias', () => {
            const alias = Crypto.generateKeys().keyId;
            return member.addAlias(alias)
                .then(() => member.getAllAliases())
                .then(aliases => assert.equal(aliases.length, 2));
        });

        it('should add and remove an alias', () => {
            const newAlias = Crypto.generateKeys().keyId;
            return member.addAlias(newAlias)
                .then(() => member.removeAlias(newAlias))
                .then(() => member.getAllAliases())
                .then(aliases => {
                    assert.equal(aliases.length, 1);
                    assert.include(aliases, alias);
                });
        });

        it('should get all aliases', () => {
            return member.getAllAliases().then(aliases => {
                assert.equal(aliases.length, 1);
            });
        });

        it('should get all keys', () => {
            return member.getPublicKeys().then(keys => {
                assert.equal(keys.length, 2);
            });
        });

        it('should link an account', () => {
            BankClient.requestLinkAccounts(alias, 100000, 'EUR').then(alp =>
                member.linkAccounts('bank-id', alp).then(accs => {
                    assert.equal(accs.length, 2);
                })
            );
        });

        it('should get accounts', () => {
            BankClient.requestLinkAccounts(alias, 100000, 'EUR').then(alp =>
                member.linkAccounts('bank-id', alp).then(() => {
                    return member.getAccounts().then(accs => {
                        assert.equal(accs.length, 2);
                    });
                })
            );
        });
    });
});
