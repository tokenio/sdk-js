const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member = {};
let username = '';

describe('Account tests', () => {
    beforeEach(async () => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        member = await Token.createMember(username);
        await member.approveKey(Crypto.strKey(keys.publicKey));
    });

    it('should get accounts', async () => {
        const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
        await member.linkAccounts('iron', alp);
        const accs = await member.getAccounts();
    });

    it('should have name and id', async () => {
        const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
        await member.linkAccounts('iron', alp);
        const accs = await member.getAccounts();
        assert.equal(accs.length, 1);
        assert.isOk(accs[0].name);
        assert.isOk(accs[0].id);
        assert.equal(accs[0].bankId, 'iron');
    });

    let account = {};

    describe('advances', () => {
        beforeEach(async () => {
            const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
            const accs = await member.linkAccounts('iron', alp);
            account = accs[0];
        });

        it('should get an empty array when there are not accounts', async () => {
            const username2 = Crypto.generateKeys().keyId;
            const member2 = await Token.createMember(username2);
            const accounts = await member2.getAccounts();
            assert.equal(accounts.length, 0);
        });

        it('should get the balance', async () => {
            const bal = await member.getBalance(account.id)
            assert.equal(parseFloat(bal.current.value), 100000);
        });
    });
});
