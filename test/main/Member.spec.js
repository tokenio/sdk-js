const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
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
            const keys2 = await member.keys();
            assert.isAtLeast(keys2.length, 2);
        });

        it('should add and remove multiple keys', async () => {
            const username = Crypto.generateKeys().keyId;
            let memberX = await Token.createMember(username);
            const keys = Crypto.generateKeys();
            const keys2 = Crypto.generateKeys();
            const keys3 = Crypto.generateKeys();
            await memberX.approveKeys(
                [keys, keys2, keys3],
                [Token.KeyLevel.LOW, Token.KeyLevel.STANDARD, Token.KeyLevel.LOW]);
            const pks = await memberX.keys();
            assert.equal(pks.length, 4);
            await memberX.removeKeys([keys.keyId, keys3.keyId]);
            const pks2 = await memberX.keys();
            assert.equal(pks2.length, 2);
        });

        it('should add and get usernames', async () => {
            const username = Crypto.generateKeys().keyId;
            await member.addUsername(username);
            const usernames = await member.usernames();
            assert.isAtLeast(usernames.length, 2);
            const firstUsername = await member.firstUsername();
            assert.isOk(firstUsername);
            assert.include(usernames, firstUsername);
        })

        it('should add multiple usernames', async () => {
            const username = Crypto.generateKeys().keyId;
            const username2 = Crypto.generateKeys().keyId;
            const username3 = Crypto.generateKeys().keyId;
            await member.addUsernames([username, username2, username3]);
            const usernames = await member.usernames();
            assert.include(usernames, username);
            assert.include(usernames, username2);
            assert.include(usernames, username3);
        });

        it('should add and remove a username', async () => {
            const newUsername = Crypto.generateKeys().keyId;
            await member.addUsername(newUsername);
            await member.removeUsername(newUsername);
            const usernames = await member.usernames();
            assert.include(usernames, username);
            assert.notInclude(usernames, newUsername);
        });

        it('should remove multiple usernames', async () => {
            const newUsername = Crypto.generateKeys().keyId;
            const newUsername2 = Crypto.generateKeys().keyId;
            await member.addUsername(newUsername);
            await member.addUsername(newUsername2);
            await member.removeUsernames([newUsername, newUsername2]);
            const usernames = await member.usernames();
            assert.include(usernames, username);
            assert.notInclude(usernames, newUsername);
            assert.notInclude(usernames, newUsername2);
        });

        it('should get all usernames', async () => {
            const usernames = await member.usernames();
            assert.isAtLeast(usernames.length, 1);
        });

        it('should get all keys', async () => {
            const keys = await member.keys();
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
