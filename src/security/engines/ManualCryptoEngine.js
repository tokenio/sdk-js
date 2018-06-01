import MemoryKeyStore from "./MemoryKeyStore";
import KeyStoreCryptoEngine from "./KeyStoreCryptoEngine";
import Crypto from '../Crypto';
import base64url from 'base64url';
import sha256 from 'fast-sha256';

/**
 * A crypto engine that's a thin wrapper around a keystore.
 */
let keys = [];
const globalKeyStore = new MemoryKeyStore();

class ManualCryptoEngine extends KeyStoreCryptoEngine {
    /**
     * Set the hardcoded keys used by ManualCryptoEngine
     *
     * @param {array} memberKeys - keys to set
     *
     * Must be an array with objects of the format:
     * {
     *     publicKey: "123456",
     *     secretKey: "123456",
     *     level: "LOW" || "STANDARD" || "PRIVILEGED",
     * }
     */
    static setKeys(memberKeys) {
        if (!memberKeys || !Array.isArray(memberKeys) || memberKeys.length < 1) {
            throw new Error('invalid keys format');
        }
        keys = memberKeys;
        for (let keyPair of keys) {
            if (!keyPair.publicKey || !keyPair.secretKey || !keyPair.level) {
                throw new Error("Invalid keyPair format");
            }
            if (typeof keyPair.publicKey === 'string') {
                keyPair.publicKey = Crypto.bufferKey(keyPair.publicKey);
            }
            if (typeof keyPair.secretKey === 'string') {
                keyPair.secretKey = Crypto.bufferKey(keyPair.secretKey);
            }
            if (!keyPair.id) {
                keyPair.id = base64url(sha256(keyPair.publicKey)).substring(0, 16);
            }
            keyPair.algorithm = 'ED25519';
        }
    }

    constructor(memberId) {
        if (keys.length < 1) {
            throw new Error('Keys must be set before constructing.');
        }
        super(memberId, globalKeyStore);
    }

    /**
     * Generate a keyPair and store it.
     *
     * @param {string} level - privilege level "LOW", "STANDARD", "PRIVILEGED"
     * @return {Object} key
     */
    async generateKey(level) {
        for (let keyPair of keys) {
            if (keyPair.level === level) {
                const cloned = clone(keyPair);
                if (cloned.secretKey) {
                    delete cloned.secretKey;
                }
                return cloned;
            }
        }
    }

    /**
     * Create a signer. Assumes we previously generated the relevant key.
     *
     * @param {string} level - privilege level "LOW", "STANDARD", "PRIVILEGED"
     * @return {Object} signer - object that implements sign, signJson
     */
    async createSigner(level) {
        const keyPairs = keys.filter((k) => (k.level === level));
        if (!keyPairs || !keyPairs.length) {
            throw new Error(`No key with level ${level} found`);
        }
        return Crypto.createSignerFromKeypair(clone(keyPairs[0]));
    }

    /**
     * Create a verifier. Assumes we have the key with the passed ID.
     *
     * @param {string} keyId - ID of key to use
     * @return {Object} signer - object that implements verify, verifyJson
     */
    async createVerifier(keyId) {
        const keyPairs = keys.filter((k) => (k.id === keyId));
        if (!keyPairs || !keyPairs.length) {
            throw new Error(`No key with id ${keyId} found`);
        }
        return Crypto.createVerifierFromKeypair(clone(keyPairs[0]));
    }
}

/**
 * Return a (shallow) copy of an object.
 *
 * If the "user" of a key pair object edits it (e.g., deleting secretKey),
 * that shouldn't affect the "stored" key pair. Thus, we can't pass around
 * references to stored objects. Instead, we do some object-copying.
 *
 * @param {Object} obj - object to copy
 * @return {Object} copy of obj
 */
function clone(obj) {
    return Object.assign({}, obj);
}

export default ManualCryptoEngine;
