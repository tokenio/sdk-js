const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let member1 = {};
let alias1 = '';
let account1 = {};

let member2 = {};
let alias2 = '';

let token1 = {};

// Set up a first member
const setUp1 = async () => {
    alias1 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
    const auth = await member1.createTestBankAccount(100000, 'EUR');
    const accs = await member1.linkAccounts(auth);
    account1 = accs[0];
};

// Set up a second member
const setUp2 = async () => {
    alias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);
    const auth = await member2.createTestBankAccount(100000, 'EUR');
    await member2.linkAccounts(auth);
};

// Set up an endorsed transfer token
const setUp3 = async () => {
    const token = await member1.createTransferToken(38.71, 'EUR')
        .setAccountId(account1.id)
        .setRedeemerAlias(alias2)
        .setToAlias(alias2)
        .execute();
    await member1.endorseToken(token.id);
    token1 = await member2.getToken(token.id);
};

describe('Error handling', () => {
    before(() => Promise.all([setUp1(), setUp2()]));
    beforeEach(setUp3);

    it('Promise should reject', async() => {
        try {
            await member2.redeemToken(token1, 10000, 'EUR');
            return Promise.reject(new Error("Call should fail"));
        } catch (err) {
            assert.include(err.message, "redeemToken");
            assert.include(err.message, "PRECONDITION");
        }
    });
});
