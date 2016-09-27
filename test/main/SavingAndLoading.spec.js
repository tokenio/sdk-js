
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

describe('Saving and loading Members', () => {
  beforeEach(() => {
    return Promise.all([setUp1()]);
  });
  it('save and login from LocalStorage', () => {
    if (BROWSER) {
      member1.saveToLocalStorage();
      const member2 = Token.loginMemberFromLocalStorage();
      return member2.getPublicKeys(keys => {
        assert.equal(keys.length, 1);
      });
    }
  });
  it('save and login keys', () => {
    const keys = member1.keys;
    const memberId = member1.id;
    const member2 = Token.loginMember(memberId, keys);
    return member2.getPublicKeys(keys => {
      assert.equal(keys.length, 1);
    });
  });
});
