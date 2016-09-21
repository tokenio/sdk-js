const lib = require('supercop.js');
import sha256 from "fast-sha256";
import base64Url from "base64Url";

function generateKeys() {
  const seed = lib.createSeed();
  const keyPair = lib.createKeyPair(seed);
  keyPair.keyId = base64Url(sha256(keyPair.publicKey)).substring(0, 16);
  return keyPair;
}

function sign(message, keys) {
  const msg = new Buffer(message);
  return base64Url(lib.sign(msg, keys.publicKey, keys.secretKey));
}

function strKey(key) {
  return base64Url(key);
}
export { generateKeys, sign, strKey };
