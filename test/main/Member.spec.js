const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
import Util from '../../src/Util';

let member = {};
let alias = '';
describe('member tests', () => {
  beforeEach(() => {
    const keys = Crypto.generateKeys();
    alias = Crypto.generateKeys().keyId;
    return Token.createMember(alias)
    .then(res => {
      member = res;
      return member.approveKey(Crypto.strKey(keys.publicKey));
    });
  });

  describe('Creating a member', () => {
    it('should add a second key', () => {
      const keys = Crypto.generateKeys();
      return member.approveKey(Crypto.strKey(keys.publicKey));
    });

    it('should add and remove a key', () => {
      const keys = Crypto.generateKeys();
      return member.approveKey(Crypto.strKey(keys.publicKey))
      .then(() => member.removeKey(keys.keyId))
      .then(mem => assert.equal(mem.keys.length, 2));
    });

    it('should add an alias', () => {
      const alias = Crypto.generateKeys().keyId;
      return member.addAlias(alias)
      .then(mem => assert.equal(mem.aliases.length, 2));
    });
    it('should add and remove an alias', () => {
      const newAlias = Crypto.generateKeys().keyId;
      return member.addAlias(newAlias)
      .then(() => member.removeAlias(newAlias))
      .then(mem => {
        assert.equal(mem.aliases.length, 1);
        assert.include(mem.aliases, alias);
      });
    });
    it('should get all aliases', () => {
      return member.getAllAliases().then(aliases => {
        assert.equal(aliases.length, 1);
      });
    });
    it('should get all keys', () => {
      return member.getPublicKeys().then(keys => {
        assert.equal(keys.length, 2);
      });
    });
    it('should link an account', () => {
      const alp = Util.accountLinkPayload({
        alias,
        accounts: [{name: 'Checking1', accountNumber: 'acc1'},
          {name: "Savings", accountNumber: '2'}]
      });
      return member.linkAccounts('bank-id', alp).then(accs => {
        assert.equal(accs.length, 2);
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
  });
});
