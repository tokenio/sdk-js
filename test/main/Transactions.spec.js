const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';

let token1 = {};
let transfer1 = {};

let destination1 = {
    account: {
        sepa: {
            iban: Token.Util.generateNonce(),
        }
    }
};

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const auth = await member1.createTestBankAccount(100000, 'EUR');
    const accs = await member1.linkAccounts(auth);
    account1 = accs[0];
};

// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
};

// Set up an endorsed transfer token
const setUp3 = async () => {
    const token = await member1.createTransferToken(38.71, 'EUR')
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .execute();
    await member1.endorseToken(token.id);
    token1 = await member2.getToken(token.id);
    transfer1 = await member2.redeemToken(token1, 10.21, 'EUR', 'giftcard', [destination1]);
};

describe('Transactions and transfers', () => {
    before(async () => {
        await Promise.all([setUp1(), setUp2()]);
        await setUp3();
    });

    it('should see a transfer', async () => {
        const transfer = await member1.getTransfer(transfer1.id);
        assert.equal(transfer.id, transfer1.id);
        assert.equal(transfer.payload.tokenId, token1.id);
    });

    it('should get all transfers', async () => {
        const pagedResult = await member1.getTransfers(token1.id, null, 100);
        assert.isAtLeast(pagedResult.data.length, 1);
        assert.isOk(pagedResult.data[0].payload.amount);
        assert.equal(pagedResult.data[0].payload.description, 'giftcard');
        assert.isString(pagedResult.offset);
    });

    it('should see transaction', async () => {
        const pagedResult = await member1.getTransactions(account1.id, null, 100);
        assert.equal(pagedResult.data[0].type, 'DEBIT');
        assert.isOk(pagedResult.data[0].id);
        assert.isOk(pagedResult.data[0].amount.currency);
        assert.isOk(pagedResult.data[0].amount.value);
        assert.isOk(pagedResult.data[0].description);
        assert.isOk(pagedResult.data[0].tokenId);
        assert.isOk(pagedResult.data[0].tokenTransferId);
        assert.isString(pagedResult.offset);
        const transaction = await member1.getTransaction(account1.id, pagedResult.data[0].id);
        assert.equal(transaction.tokenId, token1.id);
    });
});
