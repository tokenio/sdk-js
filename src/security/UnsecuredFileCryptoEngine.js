import Crypto from './Crypto';

let fs;
if (!BROWSER) {
    fs = require('fs');
}

class FileReadError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, FileReadError);
    }
}

class JSONParseError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, JSONParseError);
    }
}

class MemberNotFoundError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, MemberNotFoundError);
    }
}

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
class UnsecuredFileCryptoEngine {
    static setFilename(absoluteFilename) {
        UnsecuredFileCryptoEngine.filename = absoluteFilename;
    }

    /**
     * Constructs the engine, using an existing member/keys if it exists in the storage
     *
     * @param {string} memberId - memberId of the member we want to create the engine for
     */
    constructor(memberId) {
        if (BROWSER) {
            throw new Error("This crypto engine can only be used in node.js, not in browser.");
        }
        if (!memberId) {
            throw new Error("Invalid memberId");
        }

        this._member = {
            id: memberId,
            keys: [],
        };

        // Check if file exists
        // If it does not exist:
        //      Create member representation, and dump
        // If it does exist:
        //      Load members
        //      Check if memberId is in there
        //      If it is:
        //           Check if keys are all there
        //           If they are:
        //               Save them in memory and return
        //           If the are not:
        //               Generate the required keys
        //               Save them in memory
        //      If it is not:
        //           Generate the required keys
        //           Save them in memory
        //      Dump it to file

        // If member already exists, use its keys. Otherwise use an empty key store
    }

    /**
     * Get's the currently active memberId. This allows login without caching memberId somewhere
     *
     * @return {string} memberId - active memberId
     */
    static getActiveMemberId() {
        const memberId = UnsecuredFileCryptoEngine.activeMemberId;
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
    async generateKey(securityLevel) {
        const loadedMember = await this._loadMember();
        let foundIndex = -1;
        for (let i = 0; i < loadedMember.keys.length; i++) {
            if (loadedMember.keys[i].level === securityLevel) {
                foundIndex = i;
            }
        }
        if (foundIndex === -1) {
            const keypair = Crypto.generateKeys(securityLevel);
            loadedMember.keys.push(keypair);
            await this._saveMember(loadedMember);
            return {
                id: keypair.id,
                level: keypair.level,
                algorithm: keypair.algorithm,
                publicKey: keypair.publicKey,
            };
        }
        return loadedMember.keys[foundIndex];
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

    async _loadMember() {
        if (!this._member.id) {
            throw new Error('Invalid memberId');
        }
        this._readFile(UnsecuredFileCryptoEngine.filename)
            .then((data) => {
                console.log('read', data);
                try {
                    const loadedMembers = JSON.parse(data);
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
                    throw new MemberNotFoundError('Member not present in the key file');
                } catch (err) {
                    throw new JSONParseError('Invalid key file, JSON parsing failed');
                }
            }).catch(() => {
                throw new FileReadError('Invalid key file, or does not exist');
            });
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
        for (let i = 0; i < UnsecuredFileCryptoEngine.members.length; i++) {
            if (UnsecuredFileCryptoEngine.members[i].id === memberCopy.id) {
                UnsecuredFileCryptoEngine.members[i] = memberCopy;
                replaced = true;
            }
        }
        if (!replaced) {
            UnsecuredFileCryptoEngine.members.push(memberCopy);
        }
    }

    _readFile() {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(UnsecuredFileCryptoEngine._filename, {encoding: 'utf-8'}, (err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _writeFile(data) {
        return new Promise((resolve, reject) => {
            try {
                if (UnsecuredFileCryptoEngine._writing) {
                    reject('Already writing to this file');
                }
                UnsecuredFileCryptoEngine._writing = true;
                fs.writeFile(
                        UnsecuredFileCryptoEngine._filename,
                        data,
                        {encoding: 'utf-8'},
                        (err) => {
                    UnsecuredFileCryptoEngine._writing = false;
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } catch (err) {
                UnsecuredFileCryptoEngine._writing = false;
                reject(err);
            }
        });
    }
}

UnsecuredFileCryptoEngine._filename = "";
UnsecuredFileCryptoEngine._writing = false;

export default UnsecuredFileCryptoEngine;
