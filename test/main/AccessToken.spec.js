const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import AccessToken from "../../src/main/AccessToken";
import Sample from "../sample/Sample";

let member = {};
let alias = {};


const setUp = () => {
    alias = Crypto.generateKeys().keyId;
    return Token
        .createMember(alias)
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
        const alias = Sample.string();
        const addressId = Sample.string();
        const token = AccessToken.addressAccessToken(member, alias, addressId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.alias, alias);
        assert.equal(json.access.resources[0].address.addressId, addressId)
    });

    it('create an account access token object', () => {
        const alias = Sample.string();
        const accountId = Sample.string();
        const token = AccessToken.accountAccessToken(member, alias, accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.alias, alias);
        assert.equal(json.access.resources[0].account.accountId, accountId)
    });

    it('create a transaction access token object', () => {
        const alias = Sample.string();
        const accountId = Sample.string();
        const token = AccessToken.transactionAccessToken(member, alias, accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.alias, alias);
        assert.equal(json.access.resources[0].transaction.accountId, accountId)
    });
});
