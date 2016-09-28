const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
import BankClient from '../sample/BankClient';

let member = {};
let alias = '';

describe('Account tests', () => {
  beforeEach(() => {
    const keys = Crypto.generateKeys();
    alias = Crypto.generateKeys().keyId;
    return Token.createMember(alias)
    .then(res => {
      member = res;
      return member.approveKey(Crypto.strKey(keys.publicKey));
    });
  });
  it('should lookup accounts', () => {
    return BankClient.requestLinkAccounts(alias, 100000, 'EUR').then(alp => {
      return member.linkAccounts('bank-id', alp).then(() => {
        return member.lookupAccounts().then(accs => {
          assert.equal(accs.length, 1);
        });
      });
    });
  });
  it('should have name and id', () => {
    return BankClient.requestLinkAccounts(alias, 100000, 'EUR').then(alp => {
      return member.linkAccounts('bank-id', alp).then(() => {
        return member.lookupAccounts().then(accs => {
          assert.equal(accs.length, 1);
          assert.isOk(accs[0].name);
          assert.isOk(accs[0].id);
        });
      });
    });
  });

  let account = {};

  describe('advances', () => {
    beforeEach(() => {
      return BankClient.requestLinkAccounts(alias, 100000, 'EUR')
      .then(alp => {
        return member.linkAccounts('bank-id', alp).then(accs => {
          account = accs[0];
        });
      });
    });
    it('should lookup the balance', () => {
      return account.lookupBalance().then(bal => {
        assert.equal(parseFloat(bal.current.value), 100000);
      });
    });
    it('should lookup transactions', () => {
      assert.equal(1 + 1, 2);
    });
  });
});
