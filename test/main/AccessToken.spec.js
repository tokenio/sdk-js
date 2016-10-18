const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/Crypto";
import AccessToken from "../../src/main/AccessToken";
import Sample from "../sample/Sample";

let member = {};
let username = {};


const setUp = () => {
    username = Crypto.generateKeys().keyId;
    return Token
        .createMember(username)
        .then(res => {
            member = res;
            return null;
        });
};

describe('AccessTokens', () => {
    before(() => {
        return setUp();
    });

    it('create an address access token object', () => {
        const username = Sample.string();
        const addressId = Sample.string();
        const token = AccessToken.addressAccessToken(member, username, addressId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].address.addressId, addressId)
    });

    it('create an account access token object', () => {
        const username = Sample.string();
        const accountId = Sample.string();
        const token = AccessToken.accountAccessToken(member, username, accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].account.accountId, accountId)
    });

    it('create a transaction access token object', () => {
        const username = Sample.string();
        const accountId = Sample.string();
        const token = AccessToken.transactionAccessToken(member, username, accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].transaction.accountId, accountId)
    });
});
