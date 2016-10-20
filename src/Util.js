const lib = require('supercop.js');

class Util {
    static generateNonce() {
        return lib.createSeed().toString('base64');
    }

    static reject(method, err) {
        return Promise.reject({
            type: method.name,
            error: err,
            reason: (err.response !== undefined && err.response.data !== undefined) ? err.response.data : "UNKNOWN"
        });
    }
}
export default Util;
