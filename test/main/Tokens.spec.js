const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
import Util from '../../src/Util';
import PaymentToken from '../../src/main/PaymentToken';

let member1 = {};
let alias1 = '';
let account1 = {};

let member2 = {};
let alias2 = '';
let account2 = {};

// Set up a first member
const setUp1 = () => {
  alias1 = Crypto.generateKeys().keyId;
  return Token.createMember(alias1)
    .then(res => {
      member1 = res;
      const alp = Util.accountLinkPayload({
        alias: alias1,
        accounts: [{name: 'Checking1', accountNumber: 'acc1'}]
      });
      return member1.linkAccounts('bank-id', alp).then(accs => {
        account1 = accs[0];
      });
    });
};

// Set up a second member
const setUp2 = () => {
  alias2 = Crypto.generateKeys().keyId;
  return Token.createMember(alias2)
    .then(res => {
      member2 = res;
      const alp = Util.accountLinkPayload({
        alias: alias2,
        accounts: [{name: 'Checking2', accountNumber: 'acc2'}]
      });
      return member2.linkAccounts('bank-id', alp).then(accs => {
        account2 = accs[0];
      });
    });
};

describe('Tokens', () => {
  beforeEach(() => {
    return Promise.all([setUp1(), setUp2()]);
  });
  it('Token creation', () => {
    const token1 = PaymentToken.create(member1, account1, 12.54, 'USD',
      alias2, 'desc');
    return account1.createTokenFromPayload(token1).then(token => {
      assert.equal(token.issuer.id, 'iron-bank');
      assert.isAtLeast(token.id.length, 5);
      assert.equal(token.payer.id, token1.payer.id);
      assert.equal(token.redeemer.alias, token1.redeemer.alias);
      assert.equal(token.amount, token1.amount);
      assert.equal(token.currency, token1.currency);
      assert.equal(token.description, token1.description);
      assert.equal(token.scheme, token1.scheme);
    });
  });

  it('Token creation simple', () => {
    return account1.createToken(9.24, 'USD', alias2).then(token => {
      assert.equal(token.issuer.id, 'iron-bank');
      assert.isAtLeast(token.id.length, 5);
      assert.equal(token.payer.id, member1.id);
      assert.equal(token.redeemer.alias, alias2);
      assert.equal(token.amount, 9.24);
      assert.equal(token.currency, 'USD');
      assert.equal(token.description, undefined);
      assert.equal(token.scheme, 'Pay/1.0');
      return account1.lookupToken(token.id)
      .then(tokenLookedUp => {
        assert.equal(token.id, tokenLookedUp.id);
        return account1.endorseToken(tokenLookedUp);
      });
    });
  });
});
