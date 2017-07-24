import Crypto from '../Crypto';

const globalStorage = {
    members: [],
    activeMemberId: "",
};

/**
 * MemoryCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engines to handle signatures, verifications, and key storage, in memory. Handles storage
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
class MemoryCryptoEngine {

    /**
     * Constructs the engines, using an existing member/keys if it exists in the storage
     *
     * @param {string} memberId - memberId of the member we want to create the engines for
     */
    constructor(memberId) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }

        this._memberId = memberId;

        // If member already exists, use its keys. Otherwise use an empty key store
        try {
            this._loadMember(this._memberId);
        } catch (error) {
            this._saveMember({
                id: this._memberId,
                keys: [],
            });
        }
        globalStorage.activeMemberId = this._memberId;
    }

    /**
     * Get's the currently active memberId. This allows login without caching memberId somewhere
     *
     * @return {string} memberId - active memberId
     */
    static getActiveMemberId() {
        const memberId = globalStorage.activeMemberId;
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    /**
     * Generates and stores a new key. Adds it to the storage, replacing the corresponding
     * old key if it exists (with the same security level).
     *
     * @param {string} securityLevel - security level of the key we want to create
     * @return {Key} key - generated key
     */
    generateKey(securityLevel) {
        const keypair = Crypto.generateKeys(securityLevel);
        const loadedMember = this._loadMember();
        let replaced = false;
        for (let i = 0; i < loadedMember.keys.length; i++) {
            if (loadedMember.keys[i].level === keypair.level) {
                loadedMember.keys[i] = keypair;
                replaced = true;
            }
        }
        if (!replaced) {
            loadedMember.keys.push(keypair);
        }
        this._saveMember(loadedMember);
        return {
            id: keypair.id,
            level: keypair.level,
            algorithm: keypair.algorithm,
            publicKey: keypair.publicKey,
        };
    }

   /**
     * Creates a signer object using the key with the specified key level. This can sign
     * strings and JSON objects.
     *
     * @param {string} securityLevel - security level of the key we want to use to sign
     * @return {Object} signer - signer object
     */
    createSigner(securityLevel) {
        const loadedMember = this._loadMember();
        for (let keys of loadedMember.keys) {
            if (keys.level === securityLevel) {
                return {
                    sign: (message) => {
                        return Crypto.sign(message, keys);
                    },
                    signJson: (json) => {
                        return Crypto.signJson(json, keys);
                    },
                    getKeyId: () => keys.id,
                };
            }
        }
        throw new Error(`No key with level ${securityLevel} found`);
    }

    /**
     * Creates a verifier object using the key with the specified key id. This can verify
     * signatures by that key, on strings and JSON objects.
     *
     * @param {string} keyId - keyId that we want to use to verify
     * @return {Object} verifier - verifier object
     */
    createVerifier(keyId) {
        const loadedMember = this._loadMember();
        for (let keys of loadedMember.keys) {
            if (keys.id === keyId) {
                return {
                    verify: (message, signature) => {
                        return Crypto.verify(message, signature, keys.publicKey);
                    },
                    verifyJson: (json, signature) => {
                        return Crypto.verifyJson(json, signature, keys.publicKey);
                    }
                };
            }
        }
        throw new Error(`No key with id ${keyId} found`);
    }

    _loadMember() {
        if (!this._memberId) {
            throw new Error('Invalid memberId');
        }
        const loadedMembers = globalStorage.members;
        for (let member of loadedMembers) {
            if (member.id === this._memberId) {
                const memberCopy = {
                    id: member.id,
                    keys: member.keys.map((key) => ({
                        id: key.id,
                        algorithm: key.algorithm,
                        level: key.level,
                        publicKey: Crypto.bufferKey(key.publicKey),
                        secretKey: Crypto.bufferKey(key.secretKey)
                    })),
                };
                return memberCopy;
            }
        }
        throw new Error('Member not found');
    }

    _saveMember(member) {
        const memberCopy = {
            id: member.id,
            keys: [],
        };
        for (let keypair of member.keys) {
            memberCopy.keys.push({
                id: keypair.id,
                level: keypair.level,
                algorithm: keypair.algorithm,
                publicKey: Crypto.strKey(keypair.publicKey),
                secretKey: Crypto.strKey(keypair.secretKey),
            });
        }

        let replaced = false;
        for (let i = 0; i < globalStorage.members.length; i++) {
            if (globalStorage.members[i].id === memberCopy.id) {
                globalStorage.members[i] = memberCopy;
                replaced = true;
            }
        }
        if (!replaced) {
            globalStorage.members.push(memberCopy);
        }
    }
}

export default MemoryCryptoEngine;
