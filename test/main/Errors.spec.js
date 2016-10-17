const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let alias1 = '';
let account1 = {};

let member2 = {};
let alias2 = '';

let token1 = {};

// Set up a first member
const setUp1 = () => {
    alias1 = Crypto.generateKeys().keyId;
    return Token.createMember(alias1)
        .then(res => {
            member1 = res;
            return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
                return member1.linkAccounts('bank-id', alp).then(accs => {
                    account1 = accs[0];
                });
            });
        });
};

// Set up a second member
const setUp2 = () => {
    alias2 = Crypto.generateKeys().keyId;
    return Token.createMember(alias2)
        .then(res => {
            member2 = res;
            return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
                return member2.linkAccounts('bank-id', alp);
            });
        });
};

// Set up an endorsed transfer token
const setUp3 = () => {
    return member1.createToken(account1.id, 38.71, 'EUR', alias2).then(token => {
        return member1.endorseToken(token.id).then(() => {
            return member2.getToken(token.id).then(lookedUp => {
                token1 = lookedUp;
            });
        });
    });
};

describe('Error handling', () => {
    before(() => {
        return Promise.all([setUp1(), setUp2()]);
    })
    beforeEach(() => {
        return setUp3();
    });

    it('Promise should reject', done => {
        member2.createTransfer(token1, 10000, 'EUR')
            .then(() => {
                console.log("here1");
                done(new Error("Call should fail"));
            })
            .catch(err => {
                assert.equal(err.type, "createTransfer");
                assert.isOk(err.error.response.data, "error should not be undefined");
                assert.include(err.reason, "PRECONDITION");
                done();
            });
        });
    });