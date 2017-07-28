/**
 * Class to provide static utility functions.
 */

class Util {
    /**
     * Generates a random nonce
     *
     * @return {string} nonce - random string
     */
    static generateNonce() {
        return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    }

    /**
     * Gets the specified byte of the 4 byte word, according to index. Assumes 2s complement
     * representation of the word
     *
     * @param {number} word - 32 bit value number, in 2s complement
     * @param {number} index - index of the byte to return
     * @return {number} result - the desired byte [0, 255]
     */
    static getByte(word, index) {
        if (index === 0) {
            return word & ((1 << 8) - 1);
        } else if (index === 1) {
            return (word & ((1 << 16) - 1)) >> 8;
        } else if (index === 2) {
            return (word & ((1 << 24)) - 1) >> 16;
        }
        const temp = (word & (((1 << 8) - 1) << 24)) >> 24;
        return temp < 0 ? (256 + temp) : temp;
    }

    /**
     * Count the number of decimal points in a number
     *
     * @param {Number} value - number
     * @return {Number} count - number of decimals
     */
   static countDecimals(value) {
       if (Math.floor(value) === value) {
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
            const reason = (err.response !== undefined && err.response.data !== undefined) ?
                    err.response.data :
                    "UNKNOWN";
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
            const reason = (err.response !== undefined && err.response.data !== undefined) ?
                    err.response.data :
                    "UNKNOWN";
            err.message = method.name + ': ' + err.message + '. Reason: ' + reason;
            throw err;
        }
    }

    /**
     * Support String to String hashing
     *
     * @deprecated Should be deleted with PR-998
     * @param {String} value - string to be hashed
     * @return {String} result - hashed string
     * TODO: Should be deleted with PR-998
     */
    static hashAndSerialize(value) {
        return value;
        // return bs58.encode(sha256(Buffer.from(value, 'utf8')));
    }
}
export default Util;
