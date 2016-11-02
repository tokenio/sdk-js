const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';

let token1 = {};

// Set up a first member
const setUp1 = () => {
    username1 = Crypto.generateKeys().keyId;
    return Token.createMember(username1)
        .then(res => {
            member1 = res;
            return BankClient.requestLinkAccounts(username1, 100000, 'EUR').then(alp => {
                return member1.linkAccounts('iron', alp).then(accs => {
                    account1 = accs[0];
                });
            });
        });
};

// Set up a second member
const setUp2 = () => {
    username2 = Crypto.generateKeys().keyId;
    return Token.createMember(username2)
        .then(res => {
            member2 = res;
            return BankClient.requestLinkAccounts(username2, 100000, 'EUR').then(alp => {
                return member2.linkAccounts('iron', alp);
            });
        });
};

// Set up an endorsed transfer token
const setUp3 = () => {
    return member1.createToken(account1.id, 38.71, 'EUR', username2).then(token => {
        return member1.endorseToken(token.id).then(() => {
            return member2.getToken(token.id).then(lookedUp => {
                token1 = lookedUp;
            });
        });
    });
};

describe('Token Redemptions', () => {
    before(() => {
        return Promise.all([setUp1(), setUp2()]);
    });
    beforeEach(() => {
        return setUp3();
    });

    it('should redeem a basic token', () => {
        return member2.createTransfer(token1, 10.21, 'EUR').then(transfer => {
            assert.equal(10.21, transfer.amount);
            assert.equal('EUR', transfer.currency);
            assert.isAtLeast(transfer.payloadSignatures.length, 1);
        });
    });

    it('should redeem a basic token by id', () => {
        return member2.createTransfer(token1.id, 15.28, 'EUR').then(transfer => {
            assert.equal(15.28, transfer.amount);
            assert.equal('EUR', transfer.currency);
            assert.isAtLeast(transfer.payloadSignatures.length, 1);
            return account1.getBalance().then(bal => {
                assert.isAtLeast(100000, bal.current.value);
            });
        });
    });

    it('should fail if redeem amount is too high', done => {
        member2.createTransfer(token1.id, 1242.28, 'EUR').then(transfer => {
            done(new Error("should fail"));
        })
            .catch(() => done());
    });

    it('should fail if redeemer is wrong', done => {
        member1.createTransfer(token1.id, 10.28, 'EUR').then(transfer => {
            done(new Error("should fail"));
        })
            .catch(() => done());
    });

    it('should fail if wrong currency', done => {
        member1.createTransfer(token1.id, 10.28, 'USD').then(transfer => {
            done(new Error("should fail"));
        })
            .catch(() => done());
    });

    it('should should redeem a token with notifications', () => {
        return member1.subscribeToNotifications('4011F723D5684EEB9D983DD718B2B2A484C23B7FB63FFBF15BE9F0F5ED239A5' +
            'B000') // Remove 0s to notify iphone
            .then(() => member2.createTransfer(token1, 10.21, 'EUR').then(transfer => {
                assert.equal(10.21, transfer.amount);
                assert.equal('EUR', transfer.currency);
                assert.isAtLeast(transfer.payloadSignatures.length, 1);
            }));
    });
});
