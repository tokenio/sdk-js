const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let member1 = {};
let alias1 = '';

describe('Addresses', () => {
    beforeEach(async () => {
        alias1 = {type: 'USERNAME', value: Token.Util.generateNonce()};
        member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
    });

    it('Add and lookup an address', async () => {
        const address = {city: 'San Francisco', country: 'US'};
        await member1.addAddress("Home", address);
        const res = await member1.getAddresses();
        assert.equal(res.length, 1);
        assert.equal(res[0].name, "Home");
        assert.deepEqual(res[0].address, address);
        assert.isOk(res[0].addressSignature);
        assert.isOk(res[0].id);
    });
});
