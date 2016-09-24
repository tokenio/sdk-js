const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from '../../src/Crypto';

let member = {};
let alias = '';
describe('member tests', () => {
  beforeEach(() => {
    const keys = Crypto.generateKeys();
    alias = Crypto.generateKeys().keyId;
    return Token.createMember(alias)
    .then((res) => {
      member = res;
      return member.approveKey(keys.publicKey);
    });

  });

  describe('Creating a member', () => {
    it('should add a second key', () => {
      const keys = Crypto.generateKeys();
      return member.approveKey(keys.publicKey);
    });

    // it('should add and remove a key', () => {
    //   const keys = Crypto.generateKeys();
    //   return member.approveKey(keys.publicKey)
    //   .then(() => member.removeKey(keys.keyId))
    //   .then((mem) => assert.equal(mem.keys.length, 1));
    // });
  });
});
