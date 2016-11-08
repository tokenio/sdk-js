const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";
import TransferToken from "../../src/main/TransferToken";
import {defaultCurrency} from "../../src/constants";

let member1 = {};
let account1 = {};
let username1 = {};

// Set up a first member
const setUp1 = () => {
    username1 = Crypto.generateKeys().keyId;
    return Token
        .createMember(username1)
        .then(res => {
            member1 = res;
            BankClient
                .requestLinkAccounts(username1, 100000, 'EUR')
                .then(alp => member1
                    .linkAccounts('iron', alp)
                    .then(accs => {
                        account1 = accs[0];
                })
            );
        });
};

describe('TransferTokens', () => {
    before(() => {
        return setUp1();
    });

    it('create a transfer token object', () => {
        const token = TransferToken
            .create(member1, account1.id, 12.54, defaultCurrency, username1, 'desc');
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member1.id);
        assert.equal(json.transfer.currency, defaultCurrency);
        assert.equal(json.transfer.amount, '12.54');
        assert.equal(json.transfer.instructions.source.accountId, account1.id);

    });

    it('should throw an error when there are too many decimals', done => {
        try {
            const token = TransferToken
                .create(member1, account1.id, 12.545325, defaultCurrency, username1, 'desc');
            done(new Error("should fail"))
        } catch (e) {
            done();
        }
    });
});
