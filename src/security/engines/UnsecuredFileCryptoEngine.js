import KeyStoreCryptoEngine from './KeyStoreCryptoEngine';
import UnsecuredFileKeyStore from './UnsecuredFileKeyStore';

/**
 * UnsecuredFileCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engine to handle signatures, verifications, and key storage, in a file. Uses the following
 * schema
 *
 * filename: memberId
 *
 * file contents: {
 *    "keys":[{
 *        "id":"HxxJ-LKfhYVSDMgC", // key ID
 *        "level":"LOW",
 *        "algorithm":"ED25519",
 *        "publicKey":"wHhFB13fbFVwXGkHPToWASQCQ3hJegQQ", // Crypto.strKey( public key )
 *        "secretKey":"YgnDobEA0HoZvM7YXvJBR1Sd006apRbeEl6BBA" // Crypto.strKey( secret key )
 *    }],
 * }
 */
const globalKeyStore = new UnsecuredFileKeyStore();

var dirRootSet = null;

class UnsecuredFileCryptoEngine extends KeyStoreCryptoEngine {
    /**
     * Set the dir in which we'll store key-files.
     * When an sdk user calls Token = new TokenLib('sandbox', './keys'),
     * that calls UnsecuredFileCryptoEngine.setDirRoot('./keys')
     *
     * @param {string} dirRoot - path
     */
    static setDirRoot(dirRoot) {
        UnsecuredFileKeyStore.setDirRoot(dirRoot);
        dirRootSet = dirRoot;
    }

    /**
     * Constructs the engine
     *
     * @param {string} memberId - memberId of the member we want to create the engine for
     */
    constructor(memberId) {
        if (BROWSER) {
            throw new Error("Not available on browser");
        }
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!dirRootSet) {
            throw new Error("No valid directory set");
        }

        super(memberId, globalKeyStore);
    }

    /**
     * Get ID of "active" member. (This would make more sense in browser,
     * where we'd use it to keep track of browser-linked member.)
     *
     * @return {string} member ID of active member (or throw if none such);
     */
    static getActiveMemberId() {
        const memberId = UnsecuredFileKeyStore.getActiveMemberId();
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }
}

export default UnsecuredFileCryptoEngine;
