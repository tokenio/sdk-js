import Util from '../Util';
import base64Url from 'base64url';
import nacl from 'tweetnacl';
import sha256 from 'fast-sha256';

/**
 * Class providing static crypto primitives for Node environments using libsodium.
 */
class CryptoNode {
    /**
     * Generates a key pair to use with the Token system.
     *
     * @param {string} keyLevel - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @param {number} expirationMs - (optional) expiration duration of the key in milliseconds
     * @param {boolean} extractable - whether the private key can be extracted into raw data
     * @return {Object} generated key pair
     */
    static async generateKeys(keyLevel, expirationMs, extractable = false) {
        const keyPair = nacl.sign.keyPair();
        keyPair.id = base64Url(sha256(keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ED25519';
        keyPair.level = keyLevel;
        keyPair.privateKey = keyPair.secretKey;
        if (expirationMs !== undefined) keyPair.expiresAtMs = (new Date()).getTime() + expirationMs;
        delete keyPair.secretKey;
        return keyPair;
    }

    /**
     * Signs a string and returns the signature.
     *
     * @param {string} message - message to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async sign(message, keys) {
        const msg = Util.wrapBuffer(message);
        return base64Url(nacl.sign.detached(msg, keys.privateKey));
    }

    /**
     * Verifies a signature on a string. Throws if verification fails.
     *
     * @param {string} message - string to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static async verify(message, signature, publicKey) {
        const msg = Util.wrapBuffer(message);
        const sig = Util.bufferKey(signature);
        const result = nacl.sign.detached.verify(msg, sig, publicKey);
        if (!result) {
            throw new Error(
                `Invalid signature ${signature} on message ${message} with pk ${publicKey}`);
        }
    }
}

export default CryptoNode;
