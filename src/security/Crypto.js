import nacl from "tweetnacl";
import sha256 from "fast-sha256";
import base64Url from "base64url";
import stringify from "json-stable-stringify";

class Crypto {
    /**
     * Generates a keypair to use with the token System
     *
     * @return {object} keyPair - keyPair
     */
    static generateKeys(keyLevel) {
        const keyPair = nacl.sign.keyPair();
        keyPair.id = base64Url(sha256(keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ED25519';
        keyPair.level = keyLevel;
        return keyPair;
    }

    /**
     * Signs a json object and returns the signature
     *
     * @param {object} json - object to sign
     * @param {object} keys - keys to sign with
     * @return {string} signature - signature
     */
    static signJson(json, keys) {
        return Crypto.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature
     *
     * @param {string} message - message to sign
     * @param {object} keys - keys to sign with
     * @return {string} signature - signature
     */
    static sign(message, keys) {
        const msg = new Buffer(message);
        return base64Url(nacl.sign.detached(msg, keys.secretKey));
    }

    /**
     * Verifies a signature on json. Throws if verification fails.
     *
     * @param {string} message - message to verify
     * @param {string} signature - signature to verify
     * @param {Buffer} public Key - public key to use for verification
     */
    static verifyJson(json, signature, publicKey) {
        return Crypto.verify(stringify(json), signature, publicKey);
    }

    /**
     * Verifies a signature. Throws if verification fails.
     *
     * @param {string} message - message to verify
     * @param {string} signature - signature to verify
     * @return {Buffer} public Key - public key to use for verification
     */
    static verify(message, signature, publicKey) {
        const msg = new Buffer(message);
        const sig = base64Url.toBuffer(signature);
        const result = nacl.sign.detached.verify(msg, sig, publicKey);
        if (!result) {
            throw new Error(
                `Invalid signature ${signature} on message ${message} with pk ${publicKey}`);
        }
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
     * Converts a key from a string to buffer.
     *
     * @param {string} key - base64Url encoded key
     * @return {Buffer} key - key in Buffer form
     */
    static bufferKey(key) {
        return base64Url.toBuffer(key);
    }
}
export default Crypto;
