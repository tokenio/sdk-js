import MemoryKeyStore from "./MemoryKeyStore";
import KeyStoreCryptoEngine from "./KeyStoreCryptoEngine";

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
                const stored = await this._keystore.put(this._memberId, keypair);
                if (stored && stored.secretKey) {
                    delete stored.secretKey;
                }
                return stored;
            }
        }
    }
}

export default ManualCryptoEngine;
