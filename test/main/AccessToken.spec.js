const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/Crypto";
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
        const token = Token.AccessToken.grantTo(username).from(member).forAddress(addressId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].address.addressId, addressId)
    });

    it('create an all addresses access token object', () => {
        const username = Sample.string();
        const token = Token.AccessToken.grantTo(username).from(member).forAllAddresses();
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.isNotNull(json.access.resources[0].allAddresses)
    });

    it('create an account access token object', () => {
        const username = Sample.string();
        const accountId = Sample.string();
        const token = Token.AccessToken.grantTo(username).from(member).forAccount(accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].account.accountId, accountId)
    });

    it('create an all accounts access token object', () => {
        const username = Sample.string();
        const token = Token.AccessToken.grantTo(username).from(member).forAllAccounts();
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.isNotNull(json.access.resources[0].allAccounts)
    });

    it('create a transaction access token object', () => {
        const username = Sample.string();
        const accountId = Sample.string();
        const token = Token.AccessToken.grantTo(username).from(member).forAccountTransactions(accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].transactions.accountId, accountId)
    });

    it('create an all account transactions access token object', () => {
        const username = Sample.string();
        const token = Token.AccessToken.grantTo(username).from(member).forAllTransactions();
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.isNotNull(json.access.resources[0].allTransactions)
    });

    it('create a balance access token object', () => {
        const username = Sample.string();
        const accountId = Sample.string();
        const token =Token.AccessToken.grantTo(username).from(member).forAccountBalances(accountId);
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.equal(json.access.resources[0].balance.accountId, accountId)
    });

    it('create an all account balance access token object', () => {
        const username = Sample.string();
        const token = Token.AccessToken.grantTo(username).from(member).forAllBalances();
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member.id);
        assert.equal(json.to.username, username);
        assert.isNotNull(json.access.resources[0].allBalances)
    });
});
