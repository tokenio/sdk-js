import CryptoEngine from './CryptoEngine';
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
class MemoryCryptoEngine extends CryptoEngine {
    constructor(memberId) {
        super(memberId, new MemoryKeyStore());
    }
}

export default MemoryCryptoEngine;
