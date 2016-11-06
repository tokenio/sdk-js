import nacl from "tweetnacl";
import base64Url from "base64Url";

class Util {
    static generateNonce() {
        return base64Url(nacl.sign.keyPair().publicKey);
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
