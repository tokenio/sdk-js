const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member = {};
let username = '';

describe('member tests', () => {
    before(async () => {
        const keys = Crypto.generateKeys();
        username = Crypto.generateKeys().keyId;
        member = await Token.createMember(username);
        await member.approveKey(keys);
    });

    describe('Creating a member', () => {
        it('should add a second key', async () => {
            const keys = Crypto.generateKeys();
            await member.approveKey(keys);
        });

        it('should add and remove a key', async () => {
            const keys = Crypto.generateKeys();
            await member.approveKey(keys);
            await member.removeKey(keys.keyId);
            const keys2 = await member.getPublicKeys();
            assert.isAtLeast(keys2.length, 2);
        });

        it('should add an username', async () => {
            const username = Crypto.generateKeys().keyId;
            await member.addUsername(username);
            const usernames = await member.getAllUsernames();
            assert.isAtLeast(usernames.length, 2);
        });

        it('should add and remove an username', async () => {
            const newUsername = Crypto.generateKeys().keyId;
            await member.addUsername(newUsername);
            await member.removeUsername(newUsername);
            const usernames = await member.getAllUsernames();
            assert.include(usernames, username);
            assert.notInclude(usernames, newUsername);
        });

        it('should get all usernames', async () => {
            const usernames = await member.getAllUsernames();
            assert.isAtLeast(usernames.length, 1);
        });

        it('should get all keys', async () => {
            const keys = await member.getPublicKeys();
            assert.isAtLeast(keys.length, 1);
        });

        it('should link an account', async () => {
            const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
            const accs = await member.linkAccounts('iron', alp);
            assert.isAtLeast(accs.length, 1);
        });

        it('should get accounts', async () => {
            const alp = await BankClient.requestLinkAccounts(username, 100000, 'EUR');
            await member.linkAccounts('iron', alp);
            const accs = await member.getAccounts();
            assert.isAtLeast(accs.length, 2);
        });
    });
});
