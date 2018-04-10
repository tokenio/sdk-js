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
    static setKeys(memberKeys) {
        keys = memberKeys;
    }

    constructor(memberId) {
        if (keys.length < 1) {
            throw new Error('Keys must be set before constructing.');
        }
        super(memberId, globalKeyStore);
    }

    /**
     * Generate a keypair and store it.
     *
     * @param {string} level - privilege level "LOW", "STANDARD", "PRIVILEGED"
     * @return {Object} key
     */
    async generateKey(level) {
        for (let keypair of keys) {
            if (keypair.level === level) {
                keypair.publicKey = Crypto.bufferKey(keypair.publicKey);
                keypair.id = base64url(sha256(keypair.publicKey)).substring(0, 16);
                keypair.secretKey = Crypto.bufferKey(keypair.secretKey);
                const stored = await this._keystore.put(this._memberId, keypair);
                if (stored && stored.secretKey) {
                    delete stored.secretKey;
                }
                return stored;
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
        await this._keystore.put(
            this._memberId,
            keys.filter((key) => (key.level === level))[0]);
        const keypair = await this._keystore.getByLevel(this._memberId, level);
        keypair.publicKey = Crypto.bufferKey(keypair.publicKey);
        keypair.id = base64url(sha256(keypair.publicKey)).substring(0, 16);
        keypair.secretKey = Crypto.bufferKey(keypair.secretKey);
        return Crypto.createSignerFromKeypair(keypair);
    }

    /**
     * Create a verifier. Assumes we have the key with the passed ID.
     *
     * @param {string} keyId - ID of key to use
     * @return {Object} signer - object that implements verify, verifyJson
     */
    async createVerifier(keyId) {
        await this._keystore.put(
            this._memberId,
            keys.filter((key) => (key.id === keyId))[0]);
        const keypair = await this._keystore.getById(this._memberId, keyId);
        keypair.publicKey = Crypto.bufferKey(keypair.publicKey);
        keypair.id = base64url(sha256(keypair.publicKey)).substring(0, 16);
        keypair.secretKey = Crypto.bufferKey(keypair.secretKey);
        return Crypto.createVerifierFromKeypair(keypair);
    }
}

export default ManualCryptoEngine;
