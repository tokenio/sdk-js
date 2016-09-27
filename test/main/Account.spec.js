const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
import Util from '../../src/Util';

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
    const alp = Util.accountLinkPayload({
      alias,
      accounts: [{name: 'Checking1', accountNumber: 'acc1'},
          {name: "Savings", accountNumber: '2'}]
    });
    return member.linkAccounts('bank-id', alp).then(() => {
      return member.lookupAccounts().then(accs => {
        assert.equal(accs.length, 2);
      });
    });
  });
  it('should have name and id', () => {
    const alp = Util.accountLinkPayload({
      alias,
      accounts: [{name: 'Checking1', accountNumber: 'acc1'}]
    });
    return member.linkAccounts('bank-id', alp).then(() => {
      return member.lookupAccounts().then(accs => {
        assert.equal(accs.length, 1);
        assert.isOk(accs[0].name);
        assert.isOk(accs[0].id);
      });
    });
  });

  let account = {};

  describe('advances', () => {
    beforeEach(() => {
      const alp = Util.accountLinkPayload({
        alias,
        accounts: [{name: 'Checking1', accountNumber: 'acc1'}]
      });
      return member.linkAccounts('bank-id', alp).then(accs => {
        account = accs[0];
        return true;
      });
    });
    // it('should change the name', () => {
    //   return account.setAccountName('newName').then(() => {
    //     assert.equal(account.name, 'newName');
    //   });
    // });
  });
});
