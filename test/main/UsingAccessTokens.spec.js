const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let grantorAlias = '';
let granteeAlias = '';
let grantor = {};
let grantee = {};
let address = {};
let grantorAccount = {};

const setUpGrantor = async () => {
    grantorAlias = {type: 'USERNAME', value: Token.Util.generateNonce()};
    grantor = await Token.createMember(grantorAlias, Token.MemoryCryptoEngine);
    address = await grantor.addAddress("name", {city: 'San Francisco', country: 'US'});
    const auth = await grantor.createTestBankAccount(100000, 'EUR');
    const accs = await grantor.linkAccounts(auth);
    grantorAccount = accs[0];
};

const setupGrantee = async () => {
    granteeAlias = {type: 'USERNAME', value: Token.Util.generateNonce()};
    grantee = await Token.createMember(granteeAlias, Token.MemoryCryptoEngine);
};

const setupToken = async () => {
    const token = await grantor.createAccessToken(granteeAlias, [{allAddresses: {}}]);
    await grantor.endorseToken(token);
    return token;
};

describe('Using access tokens', async () => {
    beforeEach(async () => {
        await setUpGrantor();
        await setupGrantee();
    });

    it('On-Behalf-Of address token', async () => {
        const token = await setupToken();
        grantee.useAccessToken(token.id);
        const result = await grantee.getAddress(address.id);
        assert.equal(result.id, address.id);
        assert.equal(result.name, address.name);
        assert.deepEqual(result.address, address.address);
    });

    it('address access token should not work if cleared token', async () => {
        const token = await setupToken();
        grantee.useAccessToken(token.id);
        grantee.clearAccessToken();
        try {
            await grantee.getAddress(address.id);
            return Promise.reject(new Error("Should not succeed"));
        } catch (e) {
            return true;
        }
    });

    it('replaced address token should work', async () => {
        const token = await setupToken();
        grantee.useAccessToken(token.id);
        const result = await grantee.getAddress(address.id);
        assert.equal(result.id, address.id);
        assert.equal(result.name, address.name);
        assert.deepEqual(result.address, address.address);
        grantee.clearAccessToken();
        const operationalResult = await grantor.replaceAndEndorseAccessToken(
                token,
                [{allBalances: {}}]);
        assert.equal(operationalResult.status, 'SUCCESS');
        grantee.useAccessToken(operationalResult.token.id);
        try {
            await grantee.getAddress(address.id);
            return Promise.reject(new Error("Should not succeed"));
        } catch (e) {}

        await grantee.getBalance(grantorAccount.id);
        grantee.clearAccessToken();
    });

    it('replaced address should work after endorsing', async () => {
      const token = await setupToken();
        grantee.useAccessToken(token.id);
        const result = await grantee.getAddress(address.id);
        assert.equal(result.id, address.id);
        assert.equal(result.name, address.name);
        assert.deepEqual(result.address, address.address);
        grantee.clearAccessToken();

        const operationalResult = await grantor.replaceAccessToken(
                    token,
                    [{allBalances: {}}]);
        assert.equal(operationalResult.status, 'MORE_SIGNATURES_NEEDED');

        grantee.useAccessToken(operationalResult.token.id);
        await grantor.endorseToken(operationalResult.token);
        try {
            await grantee.getAddress(address.id);
            return Promise.reject(new Error("Should not succeed"));
        } catch (e) {}
        await grantee.getBalance(grantorAccount.id);
        grantee.clearAccessToken();
    });

    it('replaced address should work with pulling token', async () => {
        const t = await setupToken();
        const token = await grantor.getToken(t.id);
        grantee.useAccessToken(token.id);
        const result = await grantee.getAddress(address.id);
        assert.equal(result.id, address.id);
        assert.equal(result.name, address.name);
        assert.deepEqual(result.address, address.address);

        grantee.clearAccessToken();
        const operationalResult = await grantor.replaceAndEndorseAccessToken(
                    token,
                    [{allBalances: {}}]);
        assert.equal(operationalResult.status, 'SUCCESS');

        grantee.useAccessToken(operationalResult.token.id);
                try {
            await grantee.getAddress(address.id);
            return Promise.reject(new Error("Should not succeed"));
        } catch (e) {}
        await grantee.getBalance(grantorAccount.id);
        grantee.clearAccessToken();
    });

    it('should get access tokens', async () => {
        await setupToken();
        const tokens = await grantor.getAccessTokens(0, 100);
        assert.isAbove(tokens.data.length, 0);
    });

    it('cancel replaced token should work', async () => {
        const token = await setupToken();
        grantee.useAccessToken(token.id);
        const result = await grantee.getAddress(address.id);
        assert.equal(result.id, address.id);
        assert.equal(result.name, address.name);
        assert.deepEqual(result.address, address.address);
        grantee.clearAccessToken();
        const operationalResult = await grantor.replaceAndEndorseAccessToken(
            token,
            [{allBalances: {}}]);
        assert.equal(operationalResult.status, 'SUCCESS');
        grantee.useAccessToken(operationalResult.token.id);
        await grantor.cancelToken(operationalResult.token.id);
        try {
            await grantee.getBalance(grantorAccount.id);
            return Promise.reject(new Error("Should not succeed"));
        } catch (e) {}
        grantee.clearAccessToken();
    });
});
