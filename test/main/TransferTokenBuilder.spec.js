const chai = require('chai');
const assert = chai.assert;
const base64js = require('base64-js');

import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";
import {defaultCurrency, KeyLevel} from "../../src/constants";

let member1 = {};
let username1 = '';
let account1 = {};

let username2 = '';
let member2 = {};
let account2 = {};

const randomArray = (len) => {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i ++) {
        arr[i] = Math.floor((Math.random() * 256));
    }
    return arr;
}

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
    const accs = await member1.linkAccounts(alp);
    account1 = accs[0];
};
// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
    const auth = await BankClient.requestLinkAccounts(username2, 100000, 'EUR');
    const accs = await member2.linkAccounts(auth);
    account2 = accs[0];
};

describe('TransferTokenBuilder', () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create a basic token', async () => {
        const token = await member1.createTransferToken(100, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .setDescription('Book purchase')
            .execute();

        assert.equal(token.payload.description, 'Book purchase');
        assert.equal(token.payload.transfer.lifetimeAmount, '100');
    });

    it('should fail where there is no source', async () => {
        try {
            const token = await member1.createTransferToken(100, defaultCurrency)
                .setRedeemerUsername(username2)
                .setDescription('Book purchase')
                .execute();
            return Promise.reject(new Error('should fail'));
        } catch (err) {
            assert.include(err.message, "No source on token");
            return true;
        }
    })

    it('should fail where there is no redeemer', async () => {
        try {
            const token = await member1.createTransferToken(100, defaultCurrency)
                .setAccountId(account1.id)
                .setDescription('Book purchase')
                .execute();
            return Promise.reject(new Error('should fail'));
        } catch (err) {
            assert.include(err.message, "No redeemer on token");
            return true;
        }
    })

    it('should create a token with attachments', async () => {
        const data = randomArray(300);
        const attachment = await member2.createBlob(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);
        const token = await member1.createTransferToken(100, defaultCurrency)
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
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
            .setRedeemerUsername(username2)
            .addAttachmentData(member1.memberId(), "js", "file1.js", data1)
            .addAttachmentData(member1.memberId(), "js", "file2.js", data2)
            .addAttachmentData(member1.memberId(), "js", "file3.js", data3)
            .execute();

        await member1.endorseToken(token);
        const blobId = token.payload.transfer.attachments[2].blobId;
        const data = (await member1.getTokenBlob(token.id, blobId)).payload.data;
        console.log(data);
        assert.include([
            base64js.fromByteArray(data1),
            base64js.fromByteArray(data2),
            base64js.fromByteArray(data3)],
            data);
    });

    it('should create a token with everything', async () => {
        const auth = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const data = randomArray(300);
        const attachment = await member2.createBlob(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);
        const token = await member1.createTransferToken(100, defaultCurrency)
            .setBankAuthorization(auth)
            .setEffectiveAtMs(new Date().getTime())
            .setExpiresAtMs(new Date().getTime() + 10000)
            .setRedeemerUsername(username2)
            .setRedeemerMemberId(member2.memberId())
            .setChargeAmount(20)
            .addDestination({
                account: {
                    sepa: {
                        iban: '123',
                    },
                }
            })
            .setToUsername(username2)
            .setToMemberId(member2.memberId())
            .setDescription('A description')
            .addAttachment(attachment)
            .execute();

        assert.equal(token.payload.transfer.attachments[0].blobId, attachment.blobId);
        assert.equal(token.payload.transfer.attachments[0].type, attachment.type);
        assert.equal(token.payload.transfer.attachments[0].name, attachment.name);
        assert.equal(token.payload.transfer.amount, 20);
        assert.equal(token.payload.transfer.lifetimeAmount, 100);
        assert.equal(token.payload.description, 'A description');
        assert.isOk(token.payload.effectiveAtMs);
        assert.isOk(token.payload.expiresAtMs);
        assert.isOk(token.payload.to.username);
        assert.isOk(token.payload.to.id);

        await member1.endorseToken(token);
        await member2.redeemToken(token, 15, defaultCurrency);
    });
});
