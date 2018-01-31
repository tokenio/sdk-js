import KeyStoreCryptoEngine from './KeyStoreCryptoEngine';
import BrowserKeyStore from './BrowserKeyStore';

/**
 * BrowserCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engine to handle signatures, verifications, and key storage, on browsers. Uses
 * LocalStorage as the storage location, and handles storage for multiple members at once.
 * Uses the following schema:
 *
 * schemaVersion: 0.2,
 *
 * activeMemberId: "m:12345:678", // member ID
 * members: {
 *  "m:12345:678": { // member ID
 *    LOW: {
 *          id: 456, // key ID
 *          algorithm: ED25519,
 *          level: LOW,
 *          publicKey: "jlfgjlrsjfglgfja", // Crypto.strKey(public key)
 *          secretKey: "ljkfsfjkfgjlfjjf", // Crypto.strKey(secret key)
 *      },
 *    STANDARD: {...},
 *    PRIVILEGED: {...},
 *  }
 * }
 *
 */
const globalKeyStore = new BrowserKeyStore();

class BrowserCryptoEngine extends KeyStoreCryptoEngine {
    /**
     * Constructs the engine, using an existing member/keys if it is in localStorage
     *
     * @param {string} memberId - memberId of the member we want to create the engine for
     */
    constructor(memberId) {
        super(memberId, globalKeyStore);
    }

    static getActiveMemberId() {
        const memberId = BrowserKeyStore.getActiveMemberId();
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    static setActiveMemberId(memberId) {
        BrowserKeyStore.setActiveMemberId(memberId);
    }
}

export default BrowserCryptoEngine;
