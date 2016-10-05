const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
import BankClient from '../sample/BankClient';

let member1 = {};
let alias1 = '';
let account1 = {};

let member2 = {};
let alias2 = '';

let token1 = {};

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
  return Token.createMember(alias2)
    .then(res => {
      member2 = res;
      return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
        return member2.linkAccounts('bank-id', alp).then(accs => {
        });
      });
    });
};

// Set up an endorsed payment token
const setUp3 = () => {
  return member1.createPaymentToken(account1.id, 38.71, 'EUR', alias2).then(token => {
    return member1.endorsePaymentToken(token.id).then(() => {
      return member2.lookupPaymentToken(token.id).then(lookedUp => {
        token1 = lookedUp;
      });
    });
  });
};

describe('Tokens', () => {
  beforeEach(() => {
    return Promise.all([setUp1(), setUp2()])
    .then(setUp3);
  });

  it('should redeem a basic token', () => {
    return member2.redeemPaymentToken(token1, 10.21, 'EUR').then(payment => {
      assert.equal(10.21, payment.amount);
      assert.equal('EUR', payment.currency);
      assert.isAtLeast(payment.signatures.length, 1);
    });
  });

  it('should redeem a basic token by id', () => {
    return member2.redeemPaymentToken(token1.id, 15.28, 'EUR').then(payment => {
      assert.equal(15.28, payment.amount);
      assert.equal('EUR', payment.currency);
      assert.isAtLeast(payment.signatures.length, 1);
      return account1.lookupBalance().then(bal => {
        assert.equal(bal.current.value, 100000 - 15.28);
      });
    });
  });

  it('should fail if redeem amount is too high', done => {
    member2.redeemPaymentToken(token1.id, 1242.28, 'EUR').then(payment => {
      done(new Error("should fail"));
    })
    .catch(() => done());
  });

  it('should fail if redeemer is wrong', done => {
    member1.redeemPaymentToken(token1.id, 10.28, 'EUR').then(payment => {
      done(new Error("should fail"));
    })
    .catch(() => done());
  });

  it('should fail if wrong currency', done => {
    member1.redeemPaymentToken(token1.id, 10.28, 'USD').then(payment => {
      done(new Error("should fail"));
    })
    .catch(() => done());
  });

  it('should should redeem a token with notifications', () => {
    return member1.subscribeDevice('36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a105355' +
    '81f97900000') // Remove 0s to notify iphone
    .then(() => member2.redeemPaymentToken(token1, 10.21, 'EUR').then(payment => {
      assert.equal(10.21, payment.amount);
      assert.equal('EUR', payment.currency);
      assert.isAtLeast(payment.signatures.length, 1);
    }));
  });
});
