import Crypto from '../Crypto';
import FileSystem from '../PromiseFileSystem';

const globals = {
    activeMemberId: ''
};

class UnsecuredFileKeyStore {
    static setDirRoot(dirRoot) {
        FileSystem.dirRoot = dirRoot;
    }

    /**
     * Store a key pair.
     *
     * @param {string} memberId - ID of member
     * @param {Object} keyPair - key pair
     * @return {Object} stored key pair
     */
    async put(memberId, keyPair) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!keyPair) {
            throw new Error("Don't know what key to put");
        }
        if (!keyPair.level) {
            throw new Error("Don't know what level to put key");
        }
        if (BROWSER) {
            throw new Error("Not available on browser");
        }
        const member = await this._loadMember(memberId) || {};
        member[keyPair.level] = keyPair;
        await this._saveMember(memberId, member);
        UnsecuredFileKeyStore.setActiveMemberId(memberId);
        return keyPair;
    }

    /**
     * Look up a key by memberId and level.
     *
     * @param {string} memberId - ID of member
     * @param {string} level - "LOW", "STANDARD", or "PRIVILEGED"
     * @return {Object} key pair
     */
    async getByLevel(memberId, level) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!level) {
            throw new Error("Don't know what key level to get");
        }
        if (BROWSER) {
            throw new Error("Not available on browser");
        }
        const member = await this._loadMember(memberId);
        if (!member) {
            throw new Error(`Member with id ${memberId} not found`);
        }
        if (!member[level]) {
            throw new Error(`No key with level ${level} found`);
        }
        UnsecuredFileKeyStore.setActiveMemberId(memberId);
        return member[level];
    }

    /**
     * Look up a key by memberId and keyId.
     *
     * @param {string} memberId - ID of member
     * @param {string} keyId - key ID
     * @return {Object} key pair
     */
    async getById(memberId, keyId) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!keyId) {
            throw new Error(`Don't know id of key to get`);
        }
        if (BROWSER) {
            throw new Error("Not available on browser");
        }
        const member = await this._loadMember(memberId);
        if (!member) {
            throw new Error(`member ${memberId} not found`);
        }
        for (const level in member) {
            if (Object.prototype.hasOwnProperty.call(member, level)) {
                if (member[level].id === keyId) {
                    UnsecuredFileKeyStore.setActiveMemberId(memberId);
                    return member[level];
                }
            }
        }
        throw new Error(`No key with id ${keyId} found`);
    }

    /**
     * Return list of member's keys.
     *
     * @param {string} memberId - ID of member
     * @return {Object} list of keys
     */
    async listKeys(memberId) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (BROWSER) {
            throw new Error("Not available on browser");
        }
        const member = await this._loadMember(memberId);
        if (!member) {
            if (!member) {
                throw new Error(`member ${memberId} not found`);
            }
        }
        UnsecuredFileKeyStore.setActiveMemberId(memberId);
        const list = [];
        for (const level in member) {
            if (member.hasOwnProperty(level)) {
                list.push(member[level]);
            }
        }
        return list;
    }

    /**
     * Keep track of the ID of the most recently active member.
     *
     * @param {string} memberId - ID of member
     */
    static setActiveMemberId(memberId) {
        globals.activeMemberId = memberId;
    }

    /**
     * Get the ID of the most recently active member.
     *
     * @return {string} ID of member
     */
    static getActiveMemberId() {
        const memberId = globals.activeMemberId;
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    /**
     * Save a member's keys.
     *
     * @param {string} memberId - member Id
     * @param {Object} member - obj dict of keys { "LOW": {...}, "STANDARD": {...}, ... }
     */
    async _saveMember(memberId, member) {
        // instead of { LOW: {...}, ... } we want [ {...}, ... ]
        // convert keys from buffer -> string
        const strKeys = [];
        for (const level in member) {
            if (member.hasOwnProperty(level)) {
                const keyCopy = Object.assign({}, member[level]);
                if (keyCopy.publicKey) {
                    keyCopy.publicKey = Crypto.strKey(keyCopy.publicKey);
                }
                if (keyCopy.privateKey) {
                    keyCopy.privateKey = Crypto.strKey(keyCopy.privateKey);
                }
                strKeys.push(keyCopy);
            }
        }
        await FileSystem.writeFile(
                memberId.split(':').join('_'),
            JSON.stringify({keys: strKeys}));
    }

    /**
     * Load a member's keys.
     *
     * @param {string} memberId - ID of member
     * @return {Object} object dict level : key {"LOW": {...}, "STANDARD": {...}, ...}
     */
    async _loadMember(memberId) {
        let data;
        try {
            data = await FileSystem.readFile(memberId.split(':').join('_'));
        } catch (error) {
            data = '{"keys":[]}';
        }
        const keyList = JSON.parse(data).keys || [];
        const member = {};
        for (let i = 0; i < keyList.length; i++) {
            const key = keyList[i];
            if (key.publicKey) {
                key.publicKey = Crypto.bufferKey(key.publicKey);
            }
            if (key.privateKey) {
                key.privateKey = Crypto.bufferKey(key.privateKey);
            }
            member[key.level] = key;
        }
        return member;
    }
}

export default UnsecuredFileKeyStore;
