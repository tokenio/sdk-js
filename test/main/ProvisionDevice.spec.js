const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';

let member1Memory = {};
let username1Memory = '';
let account1Memory = {};

let member2Memory = {};
let username2Memory = '';

// Set up a first member
const setUp1 = async () => {
    if (BROWSER) {
        window.localStorage.clear();
        username1 = Token.Util.generateNonce();
        member1 = await Token.createMember(username1, Token.BrowserCryptoEngine);
        const auth = await member1.createTestBankAccount(100000, 'EUR', 'iron');
        const accs = await member1.linkAccounts(auth);
        account1 = accs[0];
    }
};

// Set up a second member
const setUp2 = async () => {
    if (BROWSER) {
        username2 = Token.Util.generateNonce();
        member2 = await Token.createMember(username2, Token.BrowserCryptoEngine);
        const auth = await member2.createTestBankAccount(100000, 'EUR', 'iron');
        await member2.linkAccounts(auth);
    }
};

// Set up a first member in memory
const setUp1Memory = async () => {
    username1Memory = Token.Util.generateNonce();
    member1Memory = await Token.createMember(username1Memory, Token.MemoryCryptoEngine);
    const auth = await member1Memory.createTestBankAccount(100000, 'EUR', 'iron');
    const accs = await member1Memory.linkAccounts(auth);
    account1Memory = accs[0];
};

// Set up a second member in memory
const setUp2Memory = async () => {
    username2Memory = Token.Util.generateNonce();
    member2Memory = await Token.createMember(username2Memory, Token.MemoryCryptoEngine);
    const auth = await member2Memory.createTestBankAccount(100000, 'EUR', 'iron');
    await member2Memory.linkAccounts(auth);
};

describe('Provisioning a new device', async () => {
    beforeEach(() => Promise.all([setUp1(), setUp2(), setUp1Memory(), setUp2Memory()]));

    if (BROWSER) {
        it('should provision a new device with localStorage', async() => {
            const deviceInfo = await Token.provisionDevice(username1, Token.BrowserCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.BrowserCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 6);
        });

        it('should provision a new LOW device with localStorage', async() => {
            const deviceInfo = await Token.provisionDeviceLow(username1, Token.BrowserCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.BrowserCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
        });

        it('should be able to endorse a token with a low key with localStorage', async() => {
            const localStorageCache = window.localStorage.members;
            window.localStorage.members = [];
            const deviceInfo = await Token.provisionDeviceLow(username1, Token.BrowserCryptoEngine);
            const localStorageCache2 = window.localStorage.members;
            window.localStorage.members = localStorageCache;
            await member1.approveKeys(deviceInfo.keys);
            window.localStorage.members = localStorageCache2;
            const memberLoggedIn = Token.login(Token.BrowserCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
            const token = await memberLoggedIn.createTransferToken(account1.id, 38.71, 'EUR', username2);
            const res = await memberLoggedIn.endorseToken(token.id);
            assert.equal(res.status, 'MORE_SIGNATURES_NEEDED');
        });
    }
    it('should provision a new device in memory', async() => {
        const deviceInfo = await Token.provisionDevice(username1Memory, Token.MemoryCryptoEngine);
        await member1Memory.approveKeys(deviceInfo.keys);
        const memberLoggedIn = Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
        assert.isAtLeast((await memberLoggedIn.keys()).length, 6);
    });

    it('should provision a new LOW device in memory', async() => {
        const deviceInfo = await Token.provisionDeviceLow(username1Memory, Token.MemoryCryptoEngine);
        await member1Memory.approveKeys(deviceInfo.keys);
        const memberLoggedIn = Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
        assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
    });
});
