import stringify from "json-stable-stringify";
import CryptoNode from "./CryptoNode";
import CryptoBrowser from "./CryptoBrowser";
import base64Url from 'base64url/dist/base64url';
import {Buffer} from 'buffer';

const CryptoLib = BROWSER ? CryptoBrowser : CryptoNode;

/**
 * Class providing static crypto primitives.
 */
class Crypto {
    /**
     * Generates a key pair to use with the Token system.
     *
     * @param {string} keyLevel - "LOW", "STANDARD", or "PRIVILEGED"
     * @param {string} expirationMs - (optional) expiration date of the key in milliseconds
     * @param {boolean} extractable - whether the private key can be extracted into raw data
     * @return {Object} generated key pair
     */
    static async generateKeys(keyLevel, expirationMs, extractable = false) {
        return await CryptoLib.generateKeys(keyLevel, expirationMs, extractable);
    }

    /**
     * Signs a json object and returns the signature
     *
     * @param {Object} json - object to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async signJson(json, keys) {
        return await Crypto.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature.
     *
     * @param {string} message - message to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async sign(message, keys) {
        return await CryptoLib.sign(message, keys);
    }

    /**
     * Helper function for crypto engine createSigner:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generateKeys
     * @return {Object} signer object
     */
    static createSignerFromKeypair(keyPair) {
        return {
            sign: async (message) => {
                return await Crypto.sign(message, keyPair);
            },
            signJson: async (json) => {
                return await Crypto.signJson(json, keyPair);
            },
            getKeyId: () => keyPair.id
        };
    }

    /**
     * Verifies a signature on a JSON object. Throws if verification fails.
     *
     * @param {Object} json - JSON object to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static async verifyJson(json, signature, publicKey) {
        await Crypto.verify(stringify(json), signature, publicKey);
    }

    /**
     * Verifies a signature on a string. Throws if verification fails.
     *
     * @param {string} message - string to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static async verify(message, signature, publicKey) {
        await CryptoLib.verify(message, signature, publicKey);
    }

    /**
     * Helper function for crypto engine createVerifier:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generateKeys, private key optional
     * @return {Object} verifier object
     */
    static createVerifierFromKeypair(keyPair) {
        return {
            verify: async (message, signature) => {
                return await Crypto.verify(message, signature, keyPair.publicKey);
            },
            verifyJson: async (json, signature) => {
                return await Crypto.verifyJson(json, signature, keyPair.publicKey);
            }
        };
    }

    /**
     * Converts a key to string.
     *
     * @param {Uint8Array} key - key to encode
     * @return {string} encoded key
     */
    static strKey(key) {
        return base64Url(key);
    }

    /**
     * Wraps buffer as an Uint8Array object.
     *
     * @param {string|Buffer} buffer - data
     * @return {Uint8Array} data
     */
    static wrapBuffer(buffer) {
        return new Uint8Array(new Buffer(buffer));
    }

    /**
     * Converts a key from a string to buffer.
     *
     * @param {string} key - base64Url encoded key
     * @return {Uint8Array} buffered key
     */
    static bufferKey(key) {
        return Crypto.wrapBuffer(base64Url.toBuffer(key));
    }
}

export default Crypto;
