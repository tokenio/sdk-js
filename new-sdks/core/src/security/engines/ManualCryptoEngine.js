import MemoryKeyStore from './MemoryKeyStore';
import KeyStoreCryptoEngine from './KeyStoreCryptoEngine';
import {base64Url} from '../Base64UrlCodec';
import sha256 from 'fast-sha256';
import Util from '../../Util';

let keys = [];
const globalKeyStore = new MemoryKeyStore();

/**
 * Crypto engine that handles hardcoded keys
 */
class ManualCryptoEngine extends KeyStoreCryptoEngine {
    /**
     * Set the hardcoded keys used by ManualCryptoEngine
     *
     * @param {Array} memberKeys - keys to set
     *
     * Must be an array with objects of the format:
     * {
     *     publicKey: '123456',
     *     privateKey: '123456',
     *     level: 'LOW' || 'STANDARD' || 'PRIVILEGED',
     * }
     */
    static async setKeys(memberKeys) {
        if (!memberKeys || !Array.isArray(memberKeys) || memberKeys.length < 1) {
            throw new Error('invalid keys format');
        }
        keys = memberKeys;
        for (const keyPair of keys) {
            if (!keyPair.publicKey || !keyPair.privateKey || !keyPair.level) {
                throw new Error('Invalid keyPair format');
            }
            if (typeof keyPair.privateKey === 'string') {
                keyPair.privateKey = Util.bufferKey(keyPair.privateKey);
            }
            if (!keyPair.id) {
                keyPair.id = base64Url(sha256(Util.bufferKey(keyPair.publicKey)))
                    .substring(0, 16);
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
     * @param {string} level - privilege level 'LOW', 'STANDARD', 'PRIVILEGED'
     * @return {Object} key
     */
    async generateKey(level) {
        for (const keyPair of keys) {
            if (keyPair.level === level) {
                const cloned = clone(keyPair);
                if (cloned.privateKey) {
                    delete cloned.privateKey;
                }
                return cloned;
            }
        }
    }

    /**
     * Create a signer. Assumes we previously generated the relevant key.
     *
     * @param {string} level - privilege level 'LOW', 'STANDARD', 'PRIVILEGED'
     * @return {Object} object that implements sign, signJson
     */
    async createSigner(level) {
        const keyPairs = keys.filter(k => (k.level === level));
        if (!keyPairs || !keyPairs.length) {
            throw new Error(`No key with level ${level} found`);
        }
        return this._crypto.createSignerFromKeyPair(clone(keyPairs[0]));
    }

    /**
     * Create a verifier. Assumes we have the key with the passed ID.
     *
     * @param {string} keyId - ID of key to use
     * @return {Object} object that implements verify, verifyJson
     */
    async createVerifier(keyId) {
        const keyPairs = keys.filter(k => (k.id === keyId));
        if (!keyPairs || !keyPairs.length) {
            throw new Error(`No key with id ${keyId} found`);
        }
        return this._crypto.createVerifierFromKeyPair(clone(keyPairs[0]));
    }
}

/**
 * Return a (shallow) copy of an object.
 *
 * If the 'user' of a key pair object edits it (e.g., deleting privateKey),
 * that shouldn't affect the 'stored' key pair. Thus, we can't pass around
 * references to stored objects. Instead, we do some object-copying.
 *
 * @param {Object} obj - object to copy
 * @return {Object} copy of obj
 */
function clone(obj) {
    return Object.assign({}, obj);
}

export default ManualCryptoEngine;
