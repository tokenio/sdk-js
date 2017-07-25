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
};

describe('Token Redemptions', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));
    beforeEach(setUp3);

    it('should redeem a basic token', async () => {
        const transfer = await member2.redeemToken(token1, 10.21, 'EUR', '', [destination1]);
        assert.equal(10.21, transfer.payload.amount.value);
        assert.equal('EUR', transfer.payload.amount.currency);
        assert.isAtLeast(transfer.payloadSignatures.length, 1);
    });

    it('should create and redeem a token with destination', async () => {
        const destination = {
            account: {
                sepa: {
                    iban: '123',
                },
            }
        };
        const token = await member1.createTransferToken(38.71, 'EUR')
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .addDestination(destination)
            .execute();
        await member1.endorseToken(token.id);

        assert.isOk(token.payload.transfer.instructions.destinations[0].account.sepa);
        const transfer = await member2.redeemToken(token, 10.21, 'EUR');
        assert.equal(10.21, transfer.payload.amount.value);
        assert.equal('EUR', transfer.payload.amount.currency);
        assert.isAtLeast(transfer.payloadSignatures.length, 1);
    });

    it('should redeem a basic token by id', async () => {
        const transfer = await member2.redeemToken(token1.id, 15.28, 'EUR', '', [destination1]);
        assert.equal(15.28, transfer.payload.amount.value);
        assert.equal('EUR', transfer.payload.amount.currency);
        assert.isAtLeast(transfer.payloadSignatures.length, 1);
        const bal = await member1.getBalance(account1.id);
        assert.isAtLeast(100000, bal.current.value);
    });

    it('should fail if redeem amount is too high', async () => {
        try {
            await member2.redeemToken(token1.id, 1242.28, 'EUR');
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            assert.include(err.message, "amount exceeded");
            return true;
        }
    });

    it('should fail if redeemer is wrong', async () => {
        try {
            await member1.redeemToken(token1.id, 10.28, 'EUR');
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            assert.include(err.message, "redeemer");
            return true;
        }
    });

    it('should fail if wrong currency', async () => {
        try {
            await member1.redeemToken(token1.id, 10.28, 'USD');
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            assert.include(err.message, "currency");
            return true;
        }
    });

    it('should should redeem a token with notifications', async () => {
        await member1.subscribeToNotifications("iron");
        const transfer = await member2.redeemToken(token1, 10.21, 'EUR', '', [destination1]);
        assert.equal(10.21, transfer.payload.amount.value);
        assert.equal('EUR', transfer.payload.amount.currency);
        assert.isAtLeast(transfer.payloadSignatures.length, 1);
    });
});
