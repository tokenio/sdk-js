const chai = require('chai');
const assert = chai.assert;
const base64js = require('base64-js');

import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

import {defaultCurrency} from "../../src/constants";

let member1 = {};
let alias1 = '';
let account1 = {};

let alias2 = '';
let member2 = {};

const randomArray = (len) => {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = Math.floor((Math.random() * 256));
    }
    return arr;
};

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
};

describe('TransferTokenBuilder', () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create a basic token', async () => {
        const token = await member1.createTransferToken(100, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerAlias(alias2)
            .setDescription('Book purchase')
            .execute();

        assert.equal(token.payload.description, 'Book purchase');
        assert.equal(token.payload.transfer.lifetimeAmount, '100');
    });

    it('should fail where there is no source', async () => {
        try {
            await member1.createTransferToken(100, defaultCurrency)
                .setRedeemerAlias(alias2)
                .setDescription('Book purchase')
                .execute();
            return Promise.reject(new Error('should fail'));
        } catch (err) {
            assert.include(err.message, "No source on token");
            return true;
        }
    });

    it('should fail where there is no redeemer', async () => {
        try {
            await member1.createTransferToken(100, defaultCurrency)
                .setAccountId(account1.id)
                .setDescription('Book purchase')
                .execute();
            return Promise.reject(new Error('should fail'));
        } catch (err) {
            assert.include(err.message, "No redeemer on token");
            return true;
        }
    });

    it('should create a token with attachments', async () => {
        const data = randomArray(300);
        const attachment = await member2.createBlob(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);
        const token = await member1.createTransferToken(100, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerAlias(alias2)
            .addAttachment(attachment)
            .execute();

        assert.equal(token.payload.transfer.attachments[0].blobId, attachment.blobId);
        assert.equal(token.payload.transfer.attachments[0].type, attachment.type);
        assert.equal(token.payload.transfer.attachments[0].name, attachment.name);
    });

    it('should create a token with attachments directly', async () => {
        const data1 = randomArray(30);
        const data2 = randomArray(40);
        const data3 = randomArray(40);

        const token = await member1.createTransferToken(100, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerAlias(alias2)
            .addAttachmentData(member1.memberId(), "js", "file1.js", data1)
            .addAttachmentData(member1.memberId(), "js", "file2.js", data2)
            .addAttachmentData(member1.memberId(), "js", "file3.js", data3)
            .execute();

        await member1.endorseToken(token);
        const blobId = token.payload.transfer.attachments[2].blobId;
        const data = (await member1.getTokenBlob(token.id, blobId)).payload.data;
        assert.include([
            base64js.fromByteArray(data1),
            base64js.fromByteArray(data2),
            base64js.fromByteArray(data3)],
            data);
    });

    it('should create a token with everything', async () => {
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const data = randomArray(300);
        const attachment = await member2.createBlob(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);
        const pricing = {
            sourceQuote: {
                accountCurrency: 'EUR',
                feesTotal: '0.88',
            },
        };
        const refId = Token.Util.generateNonce();
        const token = await member1.createTransferToken(100, defaultCurrency)
            .setBankAuthorization(auth)
            .setEffectiveAtMs(new Date().getTime() - 2000)
            .setExpiresAtMs(new Date().getTime() + 10000)
            .setRedeemerAlias(alias2)
            .setRedeemerMemberId(member2.memberId())
            .setChargeAmount(20)
            .addDestination({
                account: {
                    sepa: {
                        iban: '123',
                    },
                }
            })
            .setToAlias(alias2)
            .setToMemberId(member2.memberId())
            .setDescription('A description')
            .addAttachment(attachment)
            .setPricing(pricing)
            .setRefId(refId)
            .execute();

        assert.equal(token.payload.transfer.attachments[0].blobId, attachment.blobId);
        assert.equal(token.payload.transfer.attachments[0].type, attachment.type);
        assert.equal(token.payload.transfer.attachments[0].name, attachment.name);
        assert.equal(token.payload.transfer.amount, 20);
        assert.equal(token.payload.transfer.lifetimeAmount, 100);
        assert.equal(token.payload.description, 'A description');
        assert.equal(token.payload.refId, refId);
        assert.deepEqual(token.payload.transfer.pricing.sourceQuote, pricing.sourceQuote);
        assert.isOk(token.payload.effectiveAtMs);
        assert.isOk(token.payload.expiresAtMs);
        assert.isOk(token.payload.to.alias);
        assert.isOk(token.payload.to.id);

        await member1.endorseToken(token);
        await member2.redeemToken(token, 15, defaultCurrency);
    });
});
