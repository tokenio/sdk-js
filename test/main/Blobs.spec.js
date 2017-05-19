const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const base64js = require('base64-js');
const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';
let account2 = {};

let token1 = {};

let destination1 = {
    account: {
        token: {
            accountId: Token.Util.generateNonce(),
            memberId: Token.Util.generateNonce(),
        }
    }
};

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
    const auth = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
    const accs = await member1.linkAccounts(auth);
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

const randomArray = (len) => {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i ++) {
        arr[i] = Math.floor((Math.random() * 256));
    }
    return arr;
}

// // Set up an endorsed transfer token
// const setUp3 = async () => {
//     const token = await member1.createTransferToken(account1.id, 38.71, 'EUR', username2);
//     await member1.endorseToken(token.id);
//     token1 = await member2.getToken(token.id);
// };

describe('Blobs', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create and get a blob', async () => {
        const data = randomArray(100);
        const attachment = await member2.uploadAttachment(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);

        const blob = await member2.downloadAttachment(attachment.blobId);
        assert.equal(attachment.blobId, blob.id);
        assert.equal(attachment.type, blob.payload.type);
        assert.equal(attachment.name, blob.payload.name);
        assert.equal(attachment.type, "text");
        assert.equal(attachment.name, "randomFile.txt");
        assert.equal(base64js.fromByteArray(data), blob.payload.data);
    });

    it('Should attach a blob to token and get it', async () => {
        const data = randomArray(100);
        const attachment = await member2.uploadAttachment(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);

        const token =
    });
});
