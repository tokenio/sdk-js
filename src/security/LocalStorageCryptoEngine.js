import Crypto from './Crypto';
import {localStorageSchemaVersion} from '../constants';

/**
 * localStorage schema:
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

class LocalStorageCryptoEngine {
    constructor(memberId) {
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        if (!memberId) {
            throw new Error("Invalid memberId");
        }

        let savedSchemaVersion;
        try {
            savedSchemaVersion = JSON.parse(window.localStorage.schemaVersion);
        } catch (syntaxError) {
            // If nothing yet in localStorage, continue
        }

        if (savedSchemaVersion < localStorageSchemaVersion) {
            window.localStorage.clear();
            window.localStorage.schemaVersion = JSON.stringify(localStorageSchemaVersion);
        }
        this._memberId = memberId;

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

    static getActiveMemberId() {
        const memberId = window.localStorage.activeMemberId;
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    generateKey(securityLevel) {
        const keypair = Crypto.generateKeys(securityLevel);
        const loadedMember = this._loadMember();
        let replaced = false;
        for (let i=0; i<loadedMember.keys.length; i++) {
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
                }
            }
        }
        throw new Error(`No key with level ${securityLevel} found`);
    }

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
                }
            }
        }
        throw new Error(`No key with id ${keyId} found`);

    }

    _loadMember() {
        if (!this._memberId) {
            throw new Error('Invalid memberId');
        }
        const loadedMembers = window.localStorage.members
            ? JSON.parse(window.localStorage.members)
            : [];
        for (let member of loadedMembers) {
            if (member.id === this._memberId) {
                for (let i=0; i<member.keys.length; i++) {
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
        }
        for (let keypair of member.keys) {
            memberCopy.keys.push({
                id: keypair.id,
                level: keypair.level,
                algorithm: keypair.algorithm,
                publicKey: Crypto.strKey(keypair.publicKey),
                secretKey: Crypto.strKey(keypair.secretKey),
            });
        }

        const loadedMembers = window.localStorage.members
            ? JSON.parse(window.localStorage.members)
            : [];
        let replaced = false;
        for (let i=0; i<loadedMembers.length; i++) {
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

export default LocalStorageCryptoEngine;
