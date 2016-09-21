const chai = require("chai");
const assert = chai.assert;
import { generateKeys, sign } from '../src/Crypto';

describe("Key management", () => {
  it("should generate a key", () => {
    const keys = generateKeys();
    assert.isOk(keys);
    assert.isString(keys.keyId);
    assert.equal(keys.keyId.length, 16)
    assert.equal(keys.publicKey.length, 32)
    assert.equal(keys.secretKey.length, 64)
  });

  it("should sign a message", () => {
    const keys = generateKeys();
    const sig = sign("abc", keys);
    assert.isAtLeast(sig.length, 50);
  })
});
