import nacl from "tweetnacl";
import base64Url from "base64url";

class Util {
    static generateNonce() {
        return base64Url(nacl.sign.keyPair().publicKey);
    }

   static countDecimals(value) {
       if(Math.floor(value) === value) {
           return 0;
       }
       return value.toString().split(".")[1].length || 0;
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
