import Crypto from '../Crypto';
import FileSystem from '../PromiseFileSystem';

/**
 * UnsecuredFileCryptoEngine: Implements the CryptoEngine interface.
 *
 * Crypto engines to handle signatures, verifications, and key storage, in a file. Uses the following
 * schema
 *
 * filename: memberId
 *
 * file contents: {
 *    "keys":[{
 *        "id":"HxxJ-LKfhYVSDMgC",
 *        "level":"LOW",
 *        "algorithm":"ED25519",
 *        "publicKey":"wHhFB13fbFVwXGkHPToWASQCQUdUndNOmqUW3hJegQQ",
 *        "secretKey":"YgnDobEA0HojV85keOYHmyGxIR9NTHuLZvM7YXvJBR1Sd006apRbeEl6BBA"
 *    }],
 * }
 */
class UnsecuredFileCryptoEngine {
    static setDirRoot(dirRoot) {
        FileSystem.dirRoot = dirRoot;
    }

    /**
     * Constructs the engines, with no keys
     *
     * @param {string} memberId - memberId of the member we want to create the engines for
     */
    constructor(memberId) {
        if (BROWSER) {
            throw new Error("Not available on browser");
        }
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!FileSystem.dirRoot) {
            throw new Error("No valid directory set");
        }

        this._member = {
            id: memberId,
            keys: [],
        };
    }

    /**
     * Generates and stores a new key. Adds it to the storage, replacing the corresponding
     * old key if it exists (with the same security level).
     *
     * @param {string} securityLevel - security level of the key we want to create
     * @return {Key} key - generated key
     */
    async generateKey(securityLevel) {
        try {
            await this._loadMember();
        } catch (error) {
            if (!error.code === 'ENOENT') {
                throw error;
            }
            await FileSystem.writeFile(this._member.id, '');  // Creates the empty file
        }

        const keypair = Crypto.generateKeys(securityLevel);

        let found = false;
        for (let i = 0; i < this._member.keys.length; i++) {
            const k = this._member.keys[i];
            if (k.level === securityLevel) {
                found = true;
                this._member.keys[i] = keypair;
            }
        }

        if (!found) {
            this._member.keys.push(keypair);
        }

        await this._saveMember();
        return keypair;
    }

   /**
     * Creates a signer object using the key with the specified key level. This can sign
     * strings and JSON objects.
     *
     * @param {string} securityLevel - security level of the key we want to use to sign
     * @return {Object} signer - signer object
     */
    async createSigner(securityLevel) {
        await this._loadMember();
        for (let keys of this._member.keys) {
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
    async createVerifier(keyId) {
        await this._loadMember();
        for (let keys of this._member.keys) {
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

        const data = await FileSystem.readFile(this._member.id.replace(':', '_'));
        this._member.keys = JSON.parse(data).keys.map((keypair => ({
            id: keypair.id,
            algorithm: keypair.algorithm,
            level: keypair.level,
            publicKey: Crypto.bufferKey(keypair.publicKey),
            secretKey: Crypto.bufferKey(keypair.secretKey)
        })));
    }

    async _saveMember() {
        const dataToWrite = {
            keys: this._member.keys.map((keypair) => ({
                id: keypair.id,
                level: keypair.level,
                algorithm: keypair.algorithm,
                publicKey: Crypto.strKey(keypair.publicKey),
                secretKey: Crypto.strKey(keypair.secretKey),
            })),
        };
        await FileSystem.writeFile(this._member.id.replace(':', '_'), JSON.stringify(dataToWrite));
    }
}

export default UnsecuredFileCryptoEngine;
