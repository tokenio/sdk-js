import Crypto from './Crypto';
import {localStorageSchemaVersion} from '../constants';

const globalStorage = {
    members: [],
}

class MemoryCryptoEngine {
    constructor(memberId) {
        if (!memberId) {
            throw new Error("Invalid memberId");
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
        globalStorage.activeMemberId = this._memberId;
    }

    static getActiveMemberId() {
        const memberId = globalStorage.activeMemberId;
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
                }
                return memberCopy;
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

        let replaced = false;
        for (let i=0; i<globalStorage.members.length; i++) {
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
