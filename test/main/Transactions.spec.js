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
let account2 = {};

let token1 = {};
let transfer1 = {};

// Set up a first member
const setUp1 = () => {
    username1 = Crypto.generateKeys().keyId;
    return Token
        .createMember(username1)
        .then(res => {
            member1 = res;
            return BankClient
                .requestLinkAccounts(username1, 100000, 'EUR')
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
    username2 = Crypto.generateKeys().keyId;
    return Token.createMember(username2)
        .then(res => {
            member2 = res;
            return BankClient.requestLinkAccounts(username1, 100000, 'EUR').then(alp => {
                return member2.linkAccounts('bank-id', alp).then(accs => {
                    account2 = accs[0];
                });
            });
        });
};

// Set up an endorsed transfer token
const setUp3 = () => {
    return member1.createToken(account1.id, 38.71, 'EUR', username2).then(token => {
        return member1.endorseToken(token.id).then(() => {
            return member2.getToken(token.id).then(lookedUp => {
                return member2.createTransfer(lookedUp, 10.21, 'EUR').then(transfer => {
                    token1 = lookedUp;
                    transfer1 = transfer;
                });
            });
        });
    });
};

describe('Transactions and transfers', () => {
    before(() => {
        return Promise.all([setUp1(), setUp2()])
            .then(setUp3);
    });

    it('should see a transfer', () => {
        return member1.getTransfer(transfer1.id).then(transfer => {
            assert.equal(transfer.id, transfer1.id);
            assert.equal(transfer.payload.tokenId, token1.id);
        });
    });

    it('should get all transfers', () => {
        return member1.getTransfers(token1.id, null, 100).then(pagedResult => {
            assert.isAtLeast(pagedResult.data.length, 1);
            assert.isOk(pagedResult.data[0].payload.amount);
            assert.isString(pagedResult.offset);
        });
    });

    it('should see transaction', () => {
        return account1.getTransactions(null, 100)
            .then(pagedResult => {
                assert.equal(pagedResult.data[0].type, 'DEBIT');
                assert.isOk(pagedResult.data[0].id);
                assert.isOk(pagedResult.data[0].currency);
                assert.isOk(pagedResult.data[0].amount);
                assert.isOk(pagedResult.data[0].description);
                assert.isOk(pagedResult.data[0].tokenId);
                assert.isOk(pagedResult.data[0].tokenTransferId);
                assert.isString(pagedResult.offset);
                return account1.getTransaction(pagedResult.data[0].id)
                    .then(transaction => {
                        assert.equal(transaction.tokenId, token1.id);
                    });
        });
    });
});
