import nacl from "tweetnacl";
import sha256 from "fast-sha256";
import base64Url from "base64url";
import stringify from "json-stable-stringify";
import Util from "../Util";
import {Buffer} from "buffer/.";

let sjcl = null;

/**
 * Initializes sjcl and mouse input collection, for IE10
 */
if (!BROWSER) {
} else if (window.crypto && window.crypto.getRandomValues) {
  // Do nothing, we have secure random crypto
} else if (window.msCrypto && window.msCrypto.getRandomValues) {
  // Do nothingm, we have secure random crypto
} else {
    // Only set it up when it is necessary
    sjcl = require('sjcl');
    sjcl.random.startCollectors();
}

/**
 * Class providing static crypto primitives.
 */
class Crypto {
    /**
     * Generates a key pair to use with the token System
     *
     * @param {string} keyLevel - desired security level of key
     * @return {object} keyPair - keyPair
     */
    static async generateKeys(keyLevel, extractable = false) {
        // if (sjcl !== null) {
        //     if (sjcl.random.isReady()) {
        //         nacl.setPRNG(function(x, n) {
        //             const randomWords = sjcl.random.randomWords(n / 4);
        //             for (let i = 0; i < n; i++) {
        //                 x[i] = Util.getByte(randomWords[Math.floor(i / 4)], i % 4);
        //             }
        //             return x;
        //         });
        //     } else {
        //         throw new Error('Not enough entropy for random number generation');
        //     }
        // }
        // const keyPair = nacl.sign.keyPair();
        // keyPair.id = base64Url(sha256(keyPair.publicKey)).substring(0, 16);
        // keyPair.algorithm = 'ED25519';
        // keyPair.level = keyLevel;
        // return keyPair;
        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            extractable,
            ['sign', 'verify'],
        );
        keyPair.publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        if (extractable) {
            keyPair.privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        }
        keyPair.id = base64Url(await crypto.subtle.digest('SHA-256', keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ECDSA';
        keyPair.level = keyLevel;
        console.log(keyPair);
        return keyPair;
    }

    /**
     * Signs a json object and returns the signature
     *
     * @param {object} json - object to sign
     * @param {object} keys - keys to sign with
     * @return {string} signature - signature
     */
    static async signJson(json, keys) {
        return await Crypto.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature
     *
     * @param {string} message - message to sign
     * @param {object} keys - keys to sign with
     * @return {string} signature - signature
     */
    static async sign(message, keys) {
        const msg = Crypto.wrapBuffer(message);
        return await crypto.subtle.sign('ECDSA', keys.privateKey, msg);
    }

    /**
     * Helper function for crypto engine createSigner:
     * returns a signer that uses a key pair.
     *
     * @param {Key} key pair - such as returned by Token.Crypto.generatekeys
     * @return {Object} signer, as expected from a crypto engine createSigner
     */
    static createSignerFromKeypair(keypair) {
        return {
            sign: async (message) => {
                return await Crypto.sign(message, keypair);
            },
            signJson: async (json) => {
                return await Crypto.signJson(json, keypair);
            },
            getKeyId: () => keypair.id,
        };
    }

    /**
     * Verifies a signature on json. Throws if verification fails.
     *
     * @param {Object} json - json message to verify
     * @param {string} signature - signature to verify
     * @param {Buffer} publicKey - public key to use for verification
     * @return {empty} empty - returns nothing if successful
     */
    static async verifyJson(json, signature, publicKey) {
        return await Crypto.verify(stringify(json), signature, publicKey);
    }

    /**
     * Verifies a signature. Throws if verification fails.
     *
     * @param {string} message - message to verify
     * @param {string} signature - signature to verify
     * @param {Buffer} publicKey - public key to use for verification
     */
    static async verify(message, signature, publicKey) {
        const msg = Crypto.wrapBuffer(message);
        const sig = Crypto.wrapBuffer(base64Url.toBuffer(signature));
        const result = await crypto.subtle.verify('ECDSA', publicKey, sig, msg);
        if (!result) {
            throw new Error(
                `Invalid signature ${signature} on message ${message} with pk ${publicKey}`);
        }
    }

    /**
     * Helper function for crypto engine createVerifier:
     * returns a signer that uses a key pair.
     *
     * @param {Key} key pair - such as returned by Token.Crypto.generatekeys. (It's OK
     *                       if this "key pair" has no secretKey.)
     * @return {Object} verifier, as expected from a crypto engine createVerifier
     */
    static createVerifierFromKeypair(keypair) {
        return {
            verify: async (message, signature) => {
                return await Crypto.verify(message, signature, keypair.publicKey);
            },
            verifyJson: async (json, signature) => {
                return await Crypto.verifyJson(json, signature, keypair.publicKey);
            }
        };
    }

    /**
     * Converts a key to string.
     *
     * @param {Buffer} key - key to encode
     * @return {string} string - encoded key
     */
    static strKey(key) {
        return base64Url(key);
    }

    /**
     * Wraps buffer as a Uint8Array Buffer object.
     *
     * @param {buffer} buffer - buffer encoded data
     * @return {Uint8Array} array - data in UintArray Buffer form
     */
    static wrapBuffer(buffer) {
        return new Uint8Array(new Buffer(buffer));
    }

    /**
     * Converts a key from a string to buffer.
     *
     * @param {string} key - base64Url encoded key
     * @return {Buffer} key - key in Buffer form
     */
    static bufferKey(key) {
        return Crypto.wrapBuffer(base64Url.toBuffer(key));
    }
}
export default Crypto;
