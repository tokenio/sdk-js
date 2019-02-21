import stringify from 'fast-json-stable-stringify';
import {base64Url} from './Base64UrlCodec';
import sha256 from 'fast-sha256';
import nacl from 'tweetnacl';
import Util from '../Util';

/**
 * Class providing static crypto primitives.
 */
class Crypto {
    /**
     * Generates a key pair to use with the Token system.
     *
     * @param {string} keyLevel - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @param {number} expirationMs - (optional) expiration duration of the key in milliseconds
     * @return {Object} generated key pair
     */
    static generateKeys(keyLevel, expirationMs) {
        const keyPair = nacl.sign.keyPair();
        keyPair.id = base64Url(sha256(keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ED25519';
        keyPair.level = keyLevel;
        keyPair.privateKey = keyPair.secretKey;
        if (expirationMs)
            keyPair.expiresAtMs = ((new Date()).getTime() + expirationMs).toString();
        delete keyPair.secretKey;
        return keyPair;
    }

    /**
     * Signs a json object and returns the signature
     *
     * @param {Object} json - object to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static signJson(json, keys) {
        return Crypto.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature.
     *
     * @param {string} message - message to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static sign(message, keys) {
        const msg = Util.wrapBuffer(message);
        return base64Url(nacl.sign.detached(msg, keys.privateKey));
    }

    /**
     * Helper function for crypto engine createSigner:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generateKeys
     * @return {Object} signer object
     */
    static createSignerFromKeyPair(keyPair) {
        return {
            sign: async message => {
                return await Crypto.sign(message, keyPair);
            },
            signJson: async json => {
                return await Crypto.signJson(json, keyPair);
            },
            getKeyId: () => keyPair.id,
        };
    }

    /**
     * Verifies a signature on a JSON object. Throws if verification fails.
     *
     * @param {Object} json - JSON object to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static verifyJson(json, signature, publicKey) {
        Crypto.verify(stringify(json), signature, publicKey);
    }

    /**
     * Verifies a signature on a string. Throws if verification fails.
     *
     * @param {string} message - string to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static verify(message, signature, publicKey) {
        const msg = Util.wrapBuffer(message);
        const sig = Util.bufferKey(signature);
        const result = nacl.sign.detached.verify(msg, sig, publicKey);
        if (!result) {
            throw new Error(
                `Invalid signature ${signature} on message ${message} with pk ${publicKey}`);
        }
    }

    /**
     * Helper function for crypto engine createVerifier:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generateKeys, only public key
     * @return {Object} verifier object
     */
    static createVerifierFromKeyPair(keyPair) {
        return {
            verify: async (message, signature) => {
                return await Crypto.verify(message, signature, keyPair.publicKey);
            },
            verifyJson: async (json, signature) => {
                return await Crypto.verifyJson(json, signature, keyPair.publicKey);
            },
        };
    }
}

export default Crypto;
