/**
 * Class to provide static utility functions.
 */
import bs58 from 'bs58';
import sha256 from "fast-sha256";
import stringify from "json-stable-stringify";

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
     * Generates a random alias. Handy for tests.
     *
     * @return {Object} alias protobuf
     */
    static randomAlias() {
        return {
            type: 'EMAIL',
            value: 'test-' + Util.generateNonce() + '+noverify@example.com'
        };
    }

    /**
     * Tests if a string ends with a suffix,
     *
     * @param {string} str - the string to test
     * @param {string} suffix - the suffix to test
     * @return {boolean} endsWith - true if it does
     */
    static stringEndsWith(str, suffix) {
        if (((str === null) || (str === '')) || ((suffix === null) || (suffix === ''))) {
            return false;
        }
        str = str.toString();
        suffix = suffix.toString();
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
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
     * Support alias hashing
     *
     * @param {Object} alias - alias to be hashed
     * @return {String} result - hashed alias
     * TODO(PR-1138): remove username support
     */
    static hashAndSerializeAlias(alias) {
        if (alias.type === 'USERNAME') {
            return alias.value;
        }
        return bs58.encode(sha256(Buffer.from(stringify(alias), 'utf8')));
    }

    /**
     * If we're on a token page, sets up an iframe to avoid CORS preflights. All requests in this
     * window will be routed through the iframe.
     *
     * @param {string} suffix - domain suffix for Iframe passthrough
     * @param {string} url - base url for the API gateway
     */
    static enableIframePassthrough(suffix, url) {
        if (BROWSER && (Util.stringEndsWith(document.domain, suffix) ||
                document.domain === suffix.substring(1))) {
            const setupAPI = function() {
                window.oldXMLHttpRequest = window.XMLHttpRequest;
                window.oldFetch = window.fetch;
                window.XMLHttpRequest = this.contentWindow.XMLHttpRequest;
                window.fetch = this.contentWindow.fetch;
            };

            let iframe = document.getElementById('tokenApiIframe');
            if (iframe === null) {
                iframe = document.createElement('iframe');
                iframe.id = 'tokenApiIframe';
                iframe.src = url + '/iframe';
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                iframe.onload = setupAPI;
                document.body.appendChild(iframe);
            }
        }
    }

    /**
     * If we're on a token page, this disables passthrough
     *
     * @param {string} suffix - domain suffix for Iframe passthrough
     */
    static disableIframePassthrough(suffix) {
        if (BROWSER && (Util.stringEndsWith(document.domain, suffix) ||
                document.domain === suffix.substring(1))) {
            if (window.oldXMLHttpRequest) {
                window.XMLHttpRequest = window.oldXMLHttpRequest;
            }
            if (window.oldFetch) {
                window.fetch = window.oldFetch;
            }
            let iframe = document.getElementById('tokenApiIframe');
            if (iframe !== null) {
                document.body.removeChild(iframe);
            }
        }
    }
}

export default Util;
