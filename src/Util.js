const lib = require('supercop.js');

class Util {
  static generateNonce() {
    return lib.createSeed().toString('base64');
  }
}
export default Util;
