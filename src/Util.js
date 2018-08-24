import bs58 from 'bs58';
import sha256 from 'fast-sha256';
import stringify from 'fast-json-stable-stringify';
import base64url from 'base64url';
import {Buffer as NodeBuffer} from 'buffer';
import {Alias} from './proto/classes';

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
        return Math.random().toString(36).slice(-9) + Math.random().toString(36).slice(-9);
    }

    /**
     * Generates a random alias. Handy for tests.
     *
     * @return {Object} alias protobuf
     */
    static randomAlias() {
        return Alias.create({
            type: 'EMAIL',
            value: 'test-' + Util.generateNonce() + '+noverify@example.com',
        });
    }

    /**
     * Returns the token alias.
     *
     * @return {Object} token alias protobuf
     */
    static tokenAlias() {
        return Alias.create({
            type: 'DOMAIN',
            value: 'token.io',
            realm: 'token',
        });
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
        return value.toString().split('.')[1].length || 0;
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
                'UNKNOWN';
            err.info = method.name + ': ' + err.message + '. Reason: ' + reason;
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
                'UNKNOWN';
            err.info = method.name + ': ' + err.message + '. Reason: ' + reason;
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
     * Hash a string value.
     *
     * @param {string} value - value to be hahsed
     * @return {string} result - hashed value
     */
    static hashString(value) {
        return bs58.encode(sha256(Buffer.from(value, 'utf8')));
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
            const iframe = document.getElementById('tokenApiIframe');
            if (iframe !== null) {
                document.body.removeChild(iframe);
            }
        }
    }

    /**
     * Gets the signing key from a list of keys corresponding to the signature.
     *
     * @param {Array} keys -  list of keys
     * @param {Object} signature - signature
     * @return {Object} key - the signing key
     */
    static getSigningKey(keys, signature) {
        for (const key of keys) {
            if (key.id === signature.keyId) {
                return key;
            }
        }
        throw new Error('Invalid signature');
    }

    /**
     * Converts a key to string.
     *
     * @param {Uint8Array} key - key to encode
     * @return {string} encoded key
     */
    static strKey(key) {
        if (typeof key === 'string') return key;
        return base64url(key);
    }

    /**
     * Wraps buffer as an Uint8Array object.
     *
     * @param {string|Buffer} buffer - data
     * @return {Uint8Array} data
     */
    static wrapBuffer(buffer) {
        return new Uint8Array(NodeBuffer.from(buffer));
    }

    /**
     * Converts a key from a string to buffer.
     *
     * @param {string} key - base64url encoded key
     * @return {Uint8Array} buffered key
     */
    static bufferKey(key) {
        return Util.wrapBuffer(base64url.toBuffer(key));
    }

    static parseParamsFromUrl(url) {
        const query = url.split('?')[1];
        const result = {};
        query.split('&').forEach(function(part) {
            const item = part.split('=');
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    static setUpHttpErrorLogging(instance) {
        instance.interceptors.response.use(
            (res) => res,
            (err) => {
                console.log(`API response error: ${err.response.status} ${err.response.statusText}, ${err.response.data} [${err.response.config.url}]`); // eslint-disable-line
                return Promise.reject(err);
            });
    }

    static isFirefox() {
        return BROWSER && typeof window.InstallTrigger !== 'undefined';
    }

    static isIE11() {
        return BROWSER && window.MSInputMethodContext && document.documentMode;
    }

    static isEdge() {
        return BROWSER && /Edge/.test(window.navigator.userAgent);
    }
}

export default Util;
