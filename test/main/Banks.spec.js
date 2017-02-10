const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/security/Crypto";

let member = {};
let username = '';

describe('Banks test', () => {
    beforeEach(async () => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        member = await Token.createMember(username);
    });

    it('should get banks and bank info', async () => {
        const banks = await member.getBanks();
        assert.isAtLeast(banks.length, 1);
        assert.isOk(banks[0].id);
        assert.isOk(banks[0].name);
        assert.isOk(banks[0].logoUri);

        const bankInfo = await member.getBankInfo(banks[0].id);
        assert.isOk(bankInfo.linkingUri);
        assert.isOk(bankInfo.redirectUriRegex);
    });

    it('should link a fake bank', async () => {
       const res = await member.createTestBankAccount(200, 'EUR');
       const accounts = await member.linkAccounts(res.bankId, res.payloads);
       assert.isAtLeast(accounts.length, 1);
    });
});