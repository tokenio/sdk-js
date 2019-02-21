import KeyStoreCryptoEngine from './KeyStoreCryptoEngine';
import MemoryKeyStore from './MemoryKeyStore';

/**
 * MemoryCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engine to handle signatures, verifications, and key storage, in memory. Handles storage
 * for multiple members at once, and uses the following schema:
 *
 * {
 *   'ACTIVE': 'm:12345:678', // member ID of most-recently active member
 *   'm:12345:678': { // a member's keys:
 *     'PRIVILEGED': {
 *          ID: '456', // key ID
 *          algorithm: ED25519,
 *          level: PRIVILEGED,
 *          publicKey: Buffer(...), // public key data
 *          privateKey: Buffer(...), // secret key data
 *      },
 *     'LOW': {...},
 *     'STANDARD': {...},
 *   },
 *   'm:91011:12d': {...} // other member's keys...
 * }
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
     * @return {string} active memberId
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
