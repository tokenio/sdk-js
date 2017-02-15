import nacl from "tweetnacl";
import base64Url from "base64url";

/**
 * Class to provide static utility functions.
 */
class Util {
    /**
     * Generates a random nonce
     *
     * @returns string nonce
     */
    static generateNonce() {
        return base64Url(nacl.sign.keyPair().publicKey);
    }

    /**
     * Count the number of decimal points in a number
     *
     * @param {Number} value - number
     * @return {Number} count - number of decimals
     */
   static countDecimals(value) {
       if(Math.floor(value) === value) {
           return 0;
       }
       return value.toString().split(".")[1].length || 0;
    }

    /**
     * Helper method to handle promise exceptions. The function will be executed, and if
     * anything fails, a rejected promise is returned, with the method name that failed,
     * included in the rejection.
     *
     * @param {function} method - outside method that is being executed
     * @param {function} fn - function to try to execute
     * @return {Promise} promise - successful or rejected promise
     */
    static async callAsync(method, fn) {
        try {
            return await fn();
        } catch (err) {
            const reason = (err.response !== undefined && err.response.data !== undefined)
                    ? err.response.data
                    : "UNKNOWN";
            err.message = method.name + ': ' + err.message + '. Reason: ' + reason;
            return Promise.reject(err);
        }
    }
    /**
     * Helper method similar to the one above, but without promises
     *
     * @param {function} method - outside method that is being executed
     * @param {function} fn - function to try to execute
     * @return {Object} result - successful result or thrown error
     */
    static callSync(method, fn) {
        try {
            return fn();
        } catch (err) {
            const reason = (err.response !== undefined && err.response.data !== undefined)
                    ? err.response.data
                    : "UNKNOWN";
            err.message = method.name + ': ' + err.message + '. Reason: ' + reason;
            throw err;
        }
    }
}
export default Util;
