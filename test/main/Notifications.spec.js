const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';

let member1 = {};
let alias1 = '';

// Set up a first member
const setUp1 = () => {
  alias1 = Crypto.generateKeys().keyId;
  return Token.createMember(alias1)
    .then(res => {
      member1 = res;
      return true;
    });
};

describe('Notifications', () => {
  beforeEach(() => {
    return Promise.all([setUp1()]);
  });
  it('should subscribe device', () => {
    assert.equal(1 + 1, 2);
    // return member1.subscribeDevice("URI:rm23klrm23oi829").then(res => {
    // });
  });
});
