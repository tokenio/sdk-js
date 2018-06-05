import Crypto from '../Crypto';

/**
 * A crypto engine that's a thin wrapper around a keystore.
 */
class KeyStoreCryptoEngine {
    constructor(memberId, keystore) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keystore) {
            throw new Error('Invalid keystore');
        }
        this._memberId = memberId;
        this._keystore = keystore;
        if (memberId && keystore.setActiveMemberId) {
            keystore.setActiveMemberId(memberId);
        }
    }

    /**
     * Generate a keypair and store it.
     *
     * @param {string} level - privilege level "LOW", "STANDARD", "PRIVILEGED"
     * @return {Object} key
     */
    async generateKey(level) {
        const keypair = Crypto.generateKeys(level);
        var stored = await this._keystore.put(this._memberId, keypair);
        if (stored && stored.secretKey) {
            delete stored.secretKey;
        }
        return stored;
    }

    /**
     * Generate a keypair with expiration date and store it.
     *
     * @param {string} level - privilege level "LOW", "STANDARD", "PRIVILEGED"
     * @param {string} expirationMs - expiration date of the key in milliseconds
     * @return {Object} key
     */
    async generateTemporaryKey(level, expirationMs) {
        const keypair = Crypto.generateTemporaryKeys(level, expirationMs);
        var stored = await this._keystore.put(this._memberId, keypair);
        if (stored && stored.secretKey) {
            delete stored.secretKey;
        }
        return stored;
    }

    /**
     * Create a signer. Assumes we previously generated the relevant key.
     *
     * @param {string} level - privilege level "LOW", "STANDARD", "PRIVILEGED"
     * @return {Object} signer - object that implements sign, signJson
     */
    async createSigner(level) {
        const keypair = await this._keystore.getByLevel(this._memberId, level);
        return Crypto.createSignerFromKeypair(keypair);
    }

    /**
     * Create a verifier. Assumes we have the key with the passed ID.
     *
     * @param {string} keyId - ID of key to use
     * @return {Object} signer - object that implements verify, verifyJson
     */
    async createVerifier(keyId) {
        const keypair = await this._keystore.getById(this._memberId, keyId);
        return Crypto.createVerifierFromKeypair(keypair);
    }
}

export default KeyStoreCryptoEngine;
