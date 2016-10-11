const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let alias1 = '';
let account1 = {};

let member2 = {};
let alias2 = '';
let account2 = {};

let token1 = {};
let payment1 = {};

// Set up a first member
const setUp1 = () => {
    alias1 = Crypto.generateKeys().keyId;
    return Token
        .createMember(alias1)
        .then(res => {
            member1 = res;
            return BankClient
                .requestLinkAccounts(alias1, 100000, 'EUR')
                .then(alp => {
                    return member1
                        .linkAccounts('bank-id', alp)
                        .then(accs => {
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
                return member2.linkAccounts('bank-id', alp).then(accs => {
                    account2 = accs[0];
                });
            });
        });
};

// Set up an endorsed payment token
const setUp3 = () => {
    return member1.createPaymentToken(account1.id, 38.71, 'EUR', alias2).then(token => {
        return member1.endorsePaymentToken(token.id).then(() => {
            return member2.getPaymentToken(token.id).then(lookedUp => {
                return member2.redeemPaymentToken(lookedUp, 10.21, 'EUR').then(payment => {
                    token1 = lookedUp;
                    payment1 = payment;
                });
            });
        });
    });
};

describe('Transactions and payments', () => {
    beforeEach(() => {
        return Promise.all([setUp1(), setUp2()])
            .then(setUp3);
    });

    it('should see a payment', () => {
        return member1.getPayment(payment1.id).then(payment => {
            assert.equal(payment.id, payment1.id);
            assert.equal(payment.payload.tokenId, token1.id);
        });
    });

    it('should get all payments', () => {
        return member1.getPayments(token1.id).then(payments => {
            assert.equal(payments.length, 1);
            assert.isOk(payments[0].payload.amount);
        });
    });

    it('should see the transaction', () => {
        return account1.getTransactions().then(transactions => {
            assert.equal(transactions[0].type, 'DEBIT');
            assert.isOk(transactions[0].id);
            assert.isOk(transactions[0].currency);
            assert.isOk(transactions[0].amount);
            assert.isOk(transactions[0].description);
            assert.isOk(transactions[0].tokenId);
            assert.isOk(transactions[0].tokenPaymentId);
        });
    });
});
