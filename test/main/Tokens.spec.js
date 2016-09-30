const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
const some = require('lodash/some');
const map = require('lodash/map');
import BankClient from '../sample/BankClient';
import {defaultCurrency} from '../../src/constants';

let member1 = {};
let alias1 = '';
let account1 = {};

let alias2 = '';

// Set up a first member
const setUp1 = () => {
  alias1 = Crypto.generateKeys().keyId;
  return Token.createMember(alias1)
    .then(res => {
      member1 = res;
      return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
        return member1.linkAccounts('bank-id', alp).then(accs => {
          account1 = accs[0];
        });
      });
    });
};

// Set up a second member
const setUp2 = () => {
  alias2 = Crypto.generateKeys().keyId;
  return Token.createMember(alias2);
};

describe('Tokens', () => {
  beforeEach(() => {
    return Promise.all([setUp1(), setUp2()]);
  });

  it('should create a token, look it up, and endorse it', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      assert.equal(token.issuer.id, 'iron-bank');
      assert.isAtLeast(token.id.length, 5);
      assert.equal(token.payer.id, member1.id);
      assert.equal(token.redeemer.alias, alias2);
      assert.equal(token.amount, 9.24);
      assert.equal(token.currency, defaultCurrency);
      assert.equal(token.description, undefined);
      assert.equal(token.scheme, 'Pay/1.0');
      return member1.lookupToken(token.id)
      .then(tokenLookedUp => {
        assert.equal(token.id, tokenLookedUp.id);
        return member1.endorseToken(token).then(() => {
          assert.equal(token.signatures.length, 2);
        });
      });
    });
  });

  it('should create a token and endorse it by id', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorseToken(token.id).then(() => {
        return member1.lookupToken(token.id).then(lookedUp => {
          assert.equal(lookedUp.signatures.length, 2);
          assert.equal(lookedUp.signatures[0].action, 'ENDORSED');
        });
      });
    });
  });

  it('should create a token and decline it', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.declineToken(token).then(() => {
        assert.equal(token.signatures.length, 2);
        assert.equal(token.signatures[0].action, 'DECLINED');
      });
    });
  });

  it('should create token and declines it by id', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.declineToken(token.id).then(() => {
        return member1.lookupToken(token.id).then(lookedUp => {
          assert.equal(lookedUp.signatures.length, 2);
          const actions = map(lookedUp.signatures, sig => sig.action);
          assert.isOk(some(actions, action => action === 'DECLINED'));
        });
      });
    });
  });

  it('should create a token, endorse it, and revoke it', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorseToken(token).then(() => {
        return member1.revokeToken(token).then(() => {
          const actions = map(token.signatures, sig => sig.action);
          assert.isOk(some(actions, action => action === 'REVOKED'));
        });
      });
    });
  });
  it('should create token, endorse it, and revoke it by id', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorseToken(token.id).then(() => {
        return member1.revokeToken(token.id).then(() => {
          return member1.lookupToken(token.id).then(lookedUp => {
            assert.equal(lookedUp.signatures.length, 4);
            const actions = map(lookedUp.signatures, sig => sig.action);
            assert.isOk(some(actions, action => action === 'REVOKED'));
          });
        });
      });
    });
  });
  it('should create token, and look it up', () => {
    return member1.createToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorseToken(token.id).then(() => {
        return member1.lookupTokens().then(tokens => {
          assert.equal(tokens.length, 1);
          assert.equal(tokens[0].signatures.length, 2);
        });
      });
    });
  });
});
