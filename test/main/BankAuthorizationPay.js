const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let member1 = {};
let alias1 = '';

let alias2 = '';

let destination1 = {
    account: {
        sepa: {
            iban: '123',
        }
    }
};

// Set up a first member
const setUp1 = async () => {
    alias1 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
};

// Set up a second member
const setUp2 = async () => {
    alias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    await Token.createMember(alias2, Token.MemoryCryptoEngine);
};

describe('Bank Authorization Payments', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create a token from a bank authorization', async () => {
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const token = await member1.createTransferToken(100, 'EUR')
            .setBankAuthorization(auth)
            .setToAlias(alias2)
            .setRedeemerAlias(alias2)
            .execute();
        const tokenLookedUp = await member1.getToken(token.id);
        assert.isOk(token);
        assert.isOk(token.payload);
        assert.isOk(token.payload.from.id);
        assert.isOk(token.payload.to.id);
        assert.isOk(token.payload.transfer.redeemer);
        assert.isOk(token.payload.transfer.instructions);
        assert.isOk(token.payload.transfer.pricing.sourceQuote);
        assert.isOk(tokenLookedUp.payload.transfer.instructions);
    });

    it('should make a payment from a bank authorization', async () => {
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const token = await member1.createTransferToken(100, 'EUR')
            .setBankAuthorization(auth)
            .setRedeemerAlias(alias1)
            .setToAlias(alias2)
            .addDestination(destination1)
            .execute();
        await member1.endorseToken(token.id);
        const transfer = await member1.redeemToken(token.id, 54, 'EUR');
        assert.equal(transfer.status, 'SUCCESS');
    });
});
