const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

let fs;
let path;
let testDir;

if (!BROWSER) {
    fs = require('fs-extra');
    path = require('path');

    // Goes back four dirs to find project base. Does this in order to create the testing dir
    // in the right place. Assumes process argv[1] is mocha binary
    testDir = path.join(path.join(
        path.dirname(path.dirname(path.dirname(path.dirname(process.argv[1])))),
        'test'), 'testDir');
}

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV, testDir);

let member1 = {};
let alias1 = '';
let accounts1 = [];

let member2 = {};
let alias2 = '';

// Set up a first member in memory
const setUp1Memory = async () => {
    alias1 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
    const auth = await member1.createTestBankAccount(100000, 'EUR');
    accounts1 = await member1.linkAccounts(auth);
};

// Set up a second member in memory
const setUp2Memory = async () => {
    alias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);
    const auth = await member2.createTestBankAccount(100000, 'EUR');
    await member2.linkAccounts(auth);
};

describe('Provisioning a new device', async () => {
    beforeEach(() => Promise.all([setUp1Memory(), setUp2Memory()]));

    if (BROWSER) {
        it('should provision a new device with localStorage', async() => {
            const deviceInfo = await Token.provisionDevice(alias1, Token.BrowserCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.BrowserCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 6);
        });

        it('should provision a new LOW device with localStorage', async() => {
            const deviceInfo = await Token.provisionDeviceLow(alias1, Token.BrowserCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.BrowserCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
        });

        it('should be able to endorse a token with a low key with localStorage', async() => {
            const deviceInfo = await Token.provisionDeviceLow(alias1, Token.BrowserCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(Token.BrowserCryptoEngine, deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
            const token = await memberLoggedIn.createTransferToken(38.71, 'EUR')
                .setAccountId(accounts1[0].id)
                .setRedeemerAlias(alias2)
                .setToAlias(alias2)
                .execute();
            const res = await memberLoggedIn.endorseToken(token.id);
            assert.equal(res.status, 'MORE_SIGNATURES_NEEDED');
        });
    } else {
        before('Should clean up the test directory', async () => {
            await fs.remove(testDir);
            const dirExists = await fs.exists(testDir);
            assert(!dirExists);
        });

        after('Should clean up the test directory', async () => {
            await fs.remove(testDir);
            const dirExists = await fs.exists(testDir);
            assert(!dirExists);
        });

        it('should provision a new device in memory', async () => {
            const deviceInfo = await Token.provisionDevice(
                    alias1,
                    Token.UnsecuredFileCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(
                    Token.UnsecuredFileCryptoEngine,
                    deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 6);
        });

        it('should provision a new LOW device in memory', async () => {
            const deviceInfo = await Token.provisionDeviceLow(
                    alias1,
                    Token.UnsecuredFileCryptoEngine);
            await member1.approveKeys(deviceInfo.keys);
            const memberLoggedIn = Token.login(
                    Token.UnsecuredFileCryptoEngine,
                    deviceInfo.memberId);
            assert.isAtLeast((await memberLoggedIn.keys()).length, 4);
        });

        it('should fail with an incorrect alias', async () => {
            try {
                await Token.provisionDeviceLow(
                    {type: 'USERNAME', value: Token.Util.generateNonce()},
                    Token.UnsecuredFileCryptoEngine);
            } catch (e) {
                assert.include(e.message, 'alias');
            }
        });
    }
});
