const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import AccessToken from "../../src/main/AccessToken";

let member = {};
let alias = {};


const setUp = () => {
    alias = Crypto.generateKeys().keyId;
    Token
        .createMember(alias)
        .then(res => {
            member = res;
        });
};

describe('AccessTokens', () => {
    before(() => {
        setUp();
    });

    it('create an address access token object', () => {
        const granteeAlias = "GranteeAlias";
        const addressId = "SomeAddressId";
        const token = AccessToken.addressAccessToken(member, granteeAlias, addressId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.grantor.id, member.id);
        assert.equal(json.grantee.alias, granteeAlias);
        assert.equal(json.resources[0].address.addressId, addressId)
    });

    it('create an account access token object', () => {
        const granteeAlias = "GranteeAlias";
        const accountId = "SomeAccountId";
        const token = AccessToken.accountAccessToken(member, granteeAlias, accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.grantor.id, member.id);
        assert.equal(json.grantee.alias, granteeAlias);
        assert.equal(json.resources[0].account.accountId, accountId)
    });

    it('create a transaction access token object', () => {
        const granteeAlias = "GranteeAlias";
        const accountId = "SomeAccountId";
        const token = AccessToken.transactionAccessToken(member, granteeAlias, accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.grantor.id, member.id);
        assert.equal(json.grantee.alias, granteeAlias);
        assert.equal(json.resources[0].transaction.accountId, accountId)
    });
});
