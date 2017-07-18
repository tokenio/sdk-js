const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const base64js = require('base64-js');
const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';

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

const randomArray = (len) => {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = Math.floor((Math.random() * 256));
    }
    return arr;
};

describe('Blobs', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create and get a blob', async () => {
        const data = randomArray(100);
        const attachment = await member2.createBlob(
                member2.memberId(),
                "text",
                "randomFile.txt",
                data);

        const blob = await member2.getBlob(attachment.blobId);
        assert.equal(attachment.blobId, blob.id);
        assert.equal(attachment.type, blob.payload.type);
        assert.equal(attachment.name, blob.payload.name);
        assert.equal(attachment.type, "text");
        assert.equal(attachment.name, "randomFile.txt");
        assert.equal(base64js.fromByteArray(data), blob.payload.data);
    });

    it('Should attach a blob to token and get it', async () => {
        const data = randomArray(100);
        const attachment = await member2.createBlob(
                member1.memberId(),
                "text",
                "randomFile.txt",
                data);

        const data2 = randomArray(1000);
        const attachment2 = await member1.createBlob(
                member1.memberId(),
                "js",
                "code.js",
                data2);

        const token = await member1.createTransferToken(500, 'EUR')
            .setAccountId(account1.id)
            .setRedeemerUsername(username2)
            .addAttachment(attachment)
            .addAttachment(attachment2)
            .execute();

        await member1.endorseToken(token);

        assert.equal(token.payload.transfer.attachments[0].blobId, attachment.blobId);
        assert.equal(token.payload.transfer.attachments[0].type, attachment.type);
        assert.equal(token.payload.transfer.attachments[0].name, attachment.name);

        const lookedUp = await member1.getTokenBlob(token.id, attachment.blobId);
        const lookedUp2 = await member2.getTokenBlob(token.id, attachment2.blobId);

        assert.equal(base64js.fromByteArray(data), lookedUp.payload.data);
        assert.equal(base64js.fromByteArray(data2), lookedUp2.payload.data);
    });
});
