import KeyStoreCryptoEngine from './KeyStoreCryptoEngine';
import MemoryKeyStore from './MemoryKeyStore';

/**
 * MemoryCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engine to handle signatures, verifications, and key storage, in memory. Handles storage
 * for multiple members at once, and uses the following schema:
 *
 * activeMemberId: 123,
 * members: [
 *  {
 *      id: 123
 *      keys: [{
 *          id: 456,
 *          algorithm: ED25519,
 *          level: PRIVILEGED,
 *          publicKey: 789,
 *          secretKey: 012,
 *      }]
 *  }
 * ]
 *
 */
const globalKeyStore = new MemoryKeyStore();

class MemoryCryptoEngine extends KeyStoreCryptoEngine {
    constructor(memberId) {
        super(memberId, globalKeyStore);
    }

    /**
     * Gets the currently active memberId.
     * This allows login without caching memberId somewhere
     *
     * @return {string} memberId - active memberId
     */
    static getActiveMemberId() {
        const memberId = MemoryKeyStore.getActiveMemberId();
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }
}

export default MemoryCryptoEngine;
