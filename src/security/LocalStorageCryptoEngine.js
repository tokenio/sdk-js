import Crypto from "./Crypto";

/**
 * localStorage schema:
 *
 * schemaVersion: 0.1
 *
 *
 * members: [
 *  {
 *      memberId: 123
 *      keys: [{
 *          id: 456,
 *          level: PRIVILEGED,
 *          publicKey: 789,
 *          privateKey: 012,
 *      }]
 *  }
 * ]
 *
 */

class LocalStorageCryptoEngine {
    constructor() {
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
    }

    generateKey() {
        const key = Crypto.generateKeys();
        const loadedMembers = window.localStorage.members
            ? JSON.parse(window.localStorage.members)
            : [];
        loadedMember.
    }

    createSigner() {

    }

    createVerifier() {

    }
}
export default LocalStorageCryptoEngine;

/**
 * Provides cryptographic support for secret management.
 */
public interface CryptoEngine {
    /**
     * Generates keys of the specified level. If the key with the specified level
     * already exists, it is replaced. Old key is still kept around because it
     * could be used for signature verification later.
     *
     * @param keyLevel key privilege level
     * @return newly generated key information
     */
    Key generateKey(Key.Level keyLevel);

    /**
     * Signs the data with the identified by the supplied key id.
     *
     * @param keyLevel level of the key to use
     * @return signer that is used to generate digital signatures
     */
    Signer createSigner(Key.Level keyLevel);

    /**
     * Verifies the payload signature.
     *
     * @param keyId key id
     * @return signature verifier
     */
    Verifier createVerifier(String keyId);
}