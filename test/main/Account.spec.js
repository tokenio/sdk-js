const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";

let member = {};
let username = '';

describe('Account tests', () => {
    beforeEach(async () => {
        const keys = Crypto.generateKeys();
        username = Token.Util.generateNonce();
        member = await Token.createMember(username, Token.MemoryCryptoEngine);
        await member.approveKey(keys);
    });

    it('should get accounts', async () => {
        const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
        await member.linkAccounts('iron', alp);
        await member.getAccounts();
    });

    it('should unlink accounts', async () => {
        const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
        await member.linkAccounts('iron', alp);
        const linked = await member.getAccounts();
        assert.equal(linked.length, 1);
        await member.unlinkAccounts([linked[0].id ]);
        const unlinked = await member.getAccounts();
        assert.equal(unlinked.length, 0);
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
            const username2 = Token.Util.generateNonce();
            const member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
            const accounts = await member2.getAccounts();
            assert.equal(accounts.length, 0);
        });

        it('should get the balance', async () => {
            const bal = await member.getBalance(account.id)
            assert.equal(parseFloat(bal.current.value), 100000);
        });

        it('should get the account info', async () => {
           const info = await member.getAccount(account.id);
           assert.equal(info.id, account.id);
           assert.isOk(info.name);
           assert.equal(info.bankId, 'iron');
        });
    });
});
