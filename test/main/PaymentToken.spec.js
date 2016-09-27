const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';
import Util from '../../src/Util';
import PaymentToken from '../../src/main/PaymentToken';

let member1 = {};
let account1 = {};
let alias1 = {};

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

describe('PaymentTokens', () => {
  before(() => {
    return setUp1();
  });

  it('create a payment token object', () => {
    const token = PaymentToken.create(member1, account1, 12.54, 'USD',
      alias1, 'desc');
    const json = token.json;
    assert.equal(json.scheme, 'Pay/1.0');
    assert.isOk(json.nonce);
    assert.equal(json.payer.id, member1.id);
    assert.equal(json.currency, 'USD');
    assert.equal(json.amount, '12.54');
    assert.equal(json.transfer.from.accountId, account1.id);
  });
});
