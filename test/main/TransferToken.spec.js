const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";
import {defaultCurrency} from "../../src/constants";

let member1 = {};
let account1 = {};
let username1 = {};

// Set up a first member
const setUp1 = async () => {
    username1 = Crypto.generateKeys().keyId;
    member1 = await Token.createMember(username1);
    const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
    const accs = await member1.linkAccounts('iron', alp);
    account1 = accs[0];
};

describe('TransferTokens', () => {
    before(setUp1);

    it('create a transfer token object', () => {
        const token = Token.TransferToken
            .create(member1, account1.id, 12.54, defaultCurrency, username1, 'desc');
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member1.id);
        assert.equal(json.transfer.currency, defaultCurrency);
        assert.equal(json.transfer.lifetimeAmount, '12.54');
        assert.equal(json.transfer.instructions.source.accountId, account1.id);

    });

    it('should throw an error when there are too many decimals', done => {
        try {
            const token = Token.TransferToken
                .create(member1, account1.id, 12.545325, defaultCurrency, username1, 'desc');
            done(new Error("should fail"))
        } catch (e) {
            done();
        }
    });
});
