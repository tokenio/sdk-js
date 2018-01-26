import Crypto from '../Crypto';
import config from "../../config.json";

/**
 * BrowserCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engine to handle signatures, verifications, and key storage, on browsers. Uses
 * LocalStorage as the storage location, and handles storage for multiple members at once.
 * Uses the following schema:
 *
 * schemaVersion: 0.1,
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
class BrowserCryptoEngine {
    /**
     * Constructs the engine, using an existing member/keys if it is in localStorage
     *
     * @param {string} memberId - memberId of the member we want to create the engine for
     */
    constructor(memberId) {
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        if (!memberId) {
            throw new Error("Invalid memberId");
        }

        // Clears the storage if we are using an old schema
        let savedSchemaVersion = 0;
        try {
            savedSchemaVersion = JSON.parse(window.localStorage.schemaVersion);
        } catch (syntaxError) {
            // If nothing yet in localStorage, continue
        }

        if (savedSchemaVersion < config.localStorageSchemaVersion) {
            window.localStorage.clear();
            window.localStorage.schemaVersion = JSON.stringify(config.localStorageSchemaVersion);
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
        window.localStorage.activeMemberId = this._memberId;
    }

    /**
     * Get's the currently active memberId. This allows login without caching memberId somewhere
     *
     * @return {string} memberId - active memberId
     */
    static getActiveMemberId() {
        const memberId = window.localStorage.activeMemberId;
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    /**
     * Generates and stores a new key. Adds it to the localStorage, replacing the corresponding
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
                return Crypto.createSignerFromKeyPair(keys);
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
                return Crypto.createVerifierFromKeypair(keys);
            }
        }
        throw new Error(`No key with id ${keyId} found`);
    }

    _loadMember() {
        if (!this._memberId) {
            throw new Error('Invalid memberId');
        }
        const loadedMembers = window.localStorage.members ?
            JSON.parse(window.localStorage.members) :
            [];
        for (let member of loadedMembers) {
            if (member.id === this._memberId) {
                for (let i = 0; i < member.keys.length; i++) {
                    member.keys[i].publicKey = Crypto.bufferKey(member.keys[i].publicKey);
                    member.keys[i].secretKey = Crypto.bufferKey(member.keys[i].secretKey);
                }
                return member;
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

        const loadedMembers = window.localStorage.members ?
            JSON.parse(window.localStorage.members) :
            [];
        let replaced = false;
        for (let i = 0; i < loadedMembers.length; i++) {
            if (loadedMembers[i].id === memberCopy.id) {
                loadedMembers[i] = memberCopy;
                replaced = true;
            }
        }
        if (!replaced) {
            loadedMembers.push(memberCopy);
        }
        window.localStorage.members = JSON.stringify(loadedMembers);
    }
}

export default BrowserCryptoEngine;
