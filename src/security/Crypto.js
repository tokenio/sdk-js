import nacl from "tweetnacl";
import sha256 from "fast-sha256";
import base64Url from "base64url";
import stringify from "json-stable-stringify";

class Crypto {
    /**
     * Generates a keypair to use with the token System
     * @return {object} keyPair - keyPair
     */
    static generateKeys(keyLevel) {
        const keyPair = nacl.sign.keyPair();
        keyPair.keyId = base64Url(sha256(keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ED25519';
        keyPair.level = keyLevel;
        return keyPair;
    }

    /**
     * Signs a json object and returns the signature
     * @param {object} json - object to sign
     * @param {object} keys - keys to sign with
     * @return {string} signature - signature
     */
    static signJson(json, keys) {
        return Crypto.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature
     * @param {string} message - message to sign
     * @param {object} keys - keys to sign with
     * @return {string} signature - signature
     */
    static sign(message, keys) {
        const msg = new Buffer(message);
        return base64Url(nacl.sign.detached(msg, keys.secretKey));
    }

    /**
     * Converts a key to string
     * @param {Buffer} key - key to encode
     * @return {string} string - encoded key
     */
    static strKey(key) {
        return base64Url(key);
    }

    /**
     * Converts a key from a string to buffer.
     * @param {string} key - base64Url encoded key
     * @return {Buffer} key - key in Buffer form
     */
    static bufferKey(key) {
        return base64Url.toBuffer(key);
    }
}
export default Crypto;
