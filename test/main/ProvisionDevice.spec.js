const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
    const accs = await member1.linkAccounts('iron', alp);
    account1 = accs[0];
};

// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
    const alp = await BankClient.requestLinkAccounts(username2, 100000, 'EUR');
    await member2.linkAccounts('iron', alp);
};

describe('Provisioning a new device', async () => {
    beforeEach(() => Promise.all([setUp1(), setUp2()]));

    if (BROWSER) {
        it('should provision a new device with localStorage', async() => {
            const deviceInfo = await Token.provisionDevice(username1, Token.LocalStorageCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.LocalStorageCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 6);
        });

        it('should provision a new LOW device with localStorage', async() => {
            const deviceInfo = await Token.provisionDeviceLow(username1, Token.LocalStorageCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.LocalStorageCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
        });

        it('should be able to endorse a token with a low key with localStorage', async() => {
            const localStorageCache = window.localStorage.members;
            // window.localStorage.members = [];
            const deviceInfo = await Token.provisionDeviceLow(username1, Token.LocalStorageCryptoEngine);
            const localStorageCache2 = window.localStorage.members;
            // window.localStorage.members = localStorageCache;
            await member1.approveKeys(deviceInfo.keys);
            // window.localStorage.members = localStorageCache2;
            const memberLoggedIn = Token.login(Token.LocalStorageCryptoEngine, deviceInfo.memberId);
            console.log(window.localStorage);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
            console.log(await memberLoggedIn.keys());
            const token = await memberLoggedIn.createToken(account1.id, 38.71, 'EUR', username2);
            const res = await memberLoggedIn.endorseToken(token.id);
            assert.equal(res.status, 'MORE_SIGNATURES_NEEDED');
        });
    }
    it('should provision a new device in memory', async() => {
        const deviceInfo = await Token.provisionDevice(username1, Token.MemoryCryptoEngine);
        await member1.approveKeys(deviceInfo.keys);
        const memberLoggedIn = Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
        assert.isAtLeast((await memberLoggedIn.keys()).length, 6);
    });

    it('should provision a new LOW device in memory', async() => {
        const deviceInfo = await Token.provisionDeviceLow(username1, Token.MemoryCryptoEngine);
        await member1.approveKeys(deviceInfo.keys);
        const memberLoggedIn = Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
        assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
    });

    it('should be able to endorse a token with a low key, in memory', async() => {
        const deviceInfo = await Token.provisionDeviceLow(username1, Token.MemoryCryptoEngine);
        await member1.approveKeys(deviceInfo.keys);
        const memberLoggedIn = Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
        assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
        const token = await memberLoggedIn.createToken(account1.id, 38.71, 'EUR', username2);
        const res = await memberLoggedIn.endorseToken(token.id);
        assert.equal(res.status, 'MORE_SIGNATURES_NEEDED');
    });
});
