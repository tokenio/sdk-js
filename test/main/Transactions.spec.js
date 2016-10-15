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
let transfer1 = {};

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

// Set up an endorsed transfer token
const setUp3 = () => {
    return member1.createToken(account1.id, 38.71, 'EUR', alias2).then(token => {
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
        return Promise.all([setUp1(), setUp2()]);
    });

    beforeEach(() => {
       return setUp3();
    });

    it('should see a transfer', () => {
        return member1.getTransfer(transfer1.id).then(transfer => {
            assert.equal(transfer.id, transfer1.id);
            assert.equal(transfer.payload.tokenId, token1.id);
        });
    });

    it('should get all transfers', () => {
        return member1.getTransfers(token1.id).then(transfers => {
            assert.isAtLeast(transfers.length, 1);
            assert.isOk(transfers[0].payload.amount);
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
            assert.isOk(transactions[0].tokenTransferId);
        });
    });
});
