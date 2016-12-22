const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

import AccessToken from "../../src/main/AccessToken";
import Sample from "../sample/Sample";


const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

let grantorUsername = '';
let granteeUsername = '';
let grantor = {};
let grantee = {};
let address = {};

const setUpGrantor = async () => {
    grantorUsername = Sample.string();
    grantor = await Token.createMember(grantorUsername);
    address = await grantor.addAddress("name", { city: 'San Francisco', country: 'US' });
};

const setupGrantee = async () => {
    granteeUsername = Sample.string();
    grantee = await Token.createMember(granteeUsername);
};

const setupToken = async () => {
    const token = await grantor.createAccessToken(Token.AccessToken.grantTo(granteeUsername).forAddress(address.id));
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
                      Token.AccessToken.createFromAccessToken(token).forAll())
        assert.equal(operationalResult.status, 'SUCCESS');

        grantee.useAccessToken(operationalResult.token.id);
        const result2 = await grantee.getAddress(address.id);
        assert.equal(result2.id, address.id);
        assert.equal(result2.name, address.name);
        assert.deepEqual(result2.address, address.address);
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

        console.log("Token:", token);
        const operationalResult = await grantor.replaceAccessToken(
                    token,
                    Token.AccessToken.createFromAccessToken(token).forAll())
        assert.equal(operationalResult.status, 'MORE_SIGNATURES_NEEDED');

        await grantor.endorseToken(operationalResult.token);
        grantee.useAccessToken(operationalResult.token.id);
        const result2 = await grantee.getAddress(address.id);
        assert.equal(result2.id, address.id);
        assert.equal(result2.name, address.name);
        assert.deepEqual(result2.address, address.address);
        grantee.clearAccessToken();
    });
});
