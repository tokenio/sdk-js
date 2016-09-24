const chai = require('chai');
const assert = chai.assert;
import Crypto from '../src/Crypto';

describe('Key management', () => {
  it('should generate a key', () => {
    for (var i = 0; i < 10; i++) {
      const keys = Crypto.generateKeys();

      assert.isOk(keys);
      assert.isString(keys.keyId);
      assert.equal(keys.keyId.length, 16);
      assert.equal(keys.publicKey.length, 32);
      assert.equal(keys.secretKey.length, 64);
    }
  });

  it('should sign a message', () => {
    for (var i = 0; i < 10; i++) {
      const keys = Crypto.generateKeys();
      const sig = Crypto.sign('abc', keys);
      assert.isAtLeast(sig.length, 50);
    }
  });
});
