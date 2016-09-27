const stringify = require('json-stable-stringify');
const lib = require('supercop.js');

class Util {
  static accountLinkPayload(alp) {
    return new Buffer(stringify(alp)).toString('base64');
  }
  static generateNonce() {
    return lib.createSeed().toString('base64');
  }
}
export default Util;
