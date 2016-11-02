const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member = {};
let username = '';

describe('Account tests', () => {
    beforeEach(() => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        return Token.createMember(username)
            .then(res => {
                member = res;
                return member.approveKey(Crypto.strKey(keys.publicKey));
            });
    });

    it('should get accounts', () => {
        return BankClient.requestLinkAccounts(username, 100000, 'EUR').then(alp => {
            return member.linkAccounts('iron', alp).then(() => {
                return member.getAccounts().then(accs => {
                    assert.equal(accs.length, 1);
                });
            });
        });
    });

    it('should have name and id', () => {
        return BankClient.requestLinkAccounts(username, 100000, 'EUR').then(alp => {
            return member.linkAccounts('iron', alp).then(() => {
                return member.getAccounts().then(accs => {
                    assert.equal(accs.length, 1);
                    assert.isOk(accs[0].name);
                    assert.isOk(accs[0].id);
                });
            });
        });
    });

    let account = {};

    describe('advances', () => {
        beforeEach(() => {
            return BankClient.requestLinkAccounts(username, 100000, 'EUR')
                .then(alp => {
                    return member.linkAccounts('iron', alp).then(accs => {
                        account = accs[0];
                    });
                });
        });

        it('should get the balance', () => {
            return account.getBalance()
                .then(bal => {
                    assert.equal(parseFloat(bal.current.value), 100000);
                });
        });
    });
});
