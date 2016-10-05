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
let member2 = {};

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
  return Token.createMember(alias2).then(member => {
    member2 = member;
  });
};

describe('Tokens', () => {
  beforeEach(() => {
    return Promise.all([setUp1(), setUp2()]);
  });

  it('should create a token, look it up, and endorse it', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      assert.equal(token.issuer.id, 'iron-bank');
      assert.isAtLeast(token.id.length, 5);
      assert.equal(token.payer.id, member1.id);
      assert.equal(token.redeemer.alias, alias2);
      assert.equal(token.amount, 9.24);
      assert.equal(token.currency, defaultCurrency);
      assert.equal(token.description, undefined);
      assert.equal(token.version, '1.0');
      return member1.lookupPaymentToken(token.id)
      .then(tokenLookedUp => {
        assert.equal(token.id, tokenLookedUp.id);
        return member1.endorsePaymentToken(token).then(() => {
          assert.equal(token.signatures.length, 2);
        });
      });
    });
  });

  it('should create a token and endorse it by id', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorsePaymentToken(token.id).then(() => {
        return member1.lookupPaymentToken(token.id).then(lookedUp => {
          assert.equal(lookedUp.signatures.length, 2);
          assert.equal(lookedUp.signatures[0].action, 'ENDORSED');
        });
      });
    });
  });

  it('should create a token and decline it', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.declinePaymentToken(token).then(() => {
        assert.equal(token.signatures.length, 2);
        assert.equal(token.signatures[0].action, 'DECLINED');
      });
    });
  });

  it('should create token and declines it by id', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.declinePaymentToken(token.id).then(() => {
        return member1.lookupPaymentToken(token.id).then(lookedUp => {
          assert.equal(lookedUp.signatures.length, 2);
          const actions = map(lookedUp.signatures, sig => sig.action);
          assert.isOk(some(actions, action => action === 'DECLINED'));
        });
      });
    });
  });

  it('should create a token, endorse it, and revoke it', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorsePaymentToken(token).then(() => {
        return member1.revokePaymentToken(token).then(() => {
          const actions = map(token.signatures, sig => sig.action);
          assert.isOk(some(actions, action => action === 'REVOKED'));
        });
      });
    });
  });
  it('should create token, endorse it, and revoke it by id', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorsePaymentToken(token.id).then(() => {
        return member1.revokePaymentToken(token.id).then(() => {
          return member1.lookupPaymentToken(token.id).then(lookedUp => {
            assert.equal(lookedUp.signatures.length, 4);
            const actions = map(lookedUp.signatures, sig => sig.action);
            assert.isOk(some(actions, action => action === 'REVOKED'));
          });
        });
      });
    });
  });

  it('should create token, and look it up', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorsePaymentToken(token.id).then(() => {
        return member1.lookupPaymentTokens().then(tokens => {
          assert.equal(tokens.length, 1);
          assert.equal(tokens[0].signatures.length, 2);
        });
      });
    });
  });

  it('should create token, and look it up, second member', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorsePaymentToken(token.id).then(() => {
        return member2.lookupPaymentTokens().then(tokens => {
          assert.equal(tokens.length, 0);
        });
      });
    });
  });

  it('should create token, and look it up, second member, tokenId', () => {
    return member1.createPaymentToken(account1.id, 9.24, defaultCurrency, alias2).then(token => {
      return member1.endorsePaymentToken(token.id).then(() => {
        return member2.lookupPaymentToken(token.id).then(t => {
          assert.equal(t.id, token.id);
        });
      });
    });
  });
});
