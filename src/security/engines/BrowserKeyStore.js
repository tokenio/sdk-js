import Crypto from '../Crypto';
import config from "../../config.json";

class BrowserKeyStore {
    _checkSchemaVersion() {
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
    }

    /**
     * Store a member's keypair.
     *
     * @param {string} memberId - ID of member
     * @param {Object} keypair - keypair to store
     * @return {Object} keypair - same keypair
     */
    async put(memberId, keypair) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!keypair) {
            throw new Error("Don't know what key to put");
        }
        if (!keypair.level) {
            throw new Error("Don't know what level to put key");
        }
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        var member = this._loadMember(memberId);
        if (!member) {
            member = {};
        }
        member[keypair.level] = keypair;
        this._saveMember(memberId, member);
        BrowserKeyStore.setActiveMemberId(memberId);
        return keypair;
    }

    /**
     * Look up a key by memberId and level.
     *
     * @param {string} memberId - ID of member
     * @param {string} level - "LOW", "STANDARD", or "PRIVILEGED"
     * @return {Object} keypair
     */
    async getByLevel(memberId, level) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!level) {
            throw new Error("Don't know what key level to get");
        }
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        const member = await this._loadMember(memberId);
        if (!member) {
            throw new Error(`Member with id ${memberId} not found`);
        }
        if (!member[level]) {
            throw new Error(`No key with level ${level} found`);
        }
        BrowserKeyStore.setActiveMemberId(memberId);
        return member[level];
    }

    /**
     * Look up a key by memberId and keyId.
     *
     * @param {string} memberId - ID of member
     * @param {string} keyId - key ID
     * @return {Object} keypair
     */
    async getById(memberId, keyId) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!keyId) {
            throw new Error(`Don't know id of key to get`);
        }
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        const member = this._loadMember(memberId);
        if (!member) {
            throw new Error(`member ${memberId} not found`);
        }
        for (let level in member) {
            if (Object.prototype.hasOwnProperty.call(member, level)) {
                if (member[level].id === keyId) {
                    BrowserKeyStore.setActiveMemberId(memberId);
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
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        const member = this._loadMember(memberId);
        if (!member) {
            if (!member) {
                throw new Error(`member ${memberId} not found`);
            }
        }
        BrowserKeyStore.setActiveMemberId(memberId);
        var list = [];
        for (var level in member) {
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
        window.localStorage.activeMemberId = memberId;
    }

   /**
     * Get the ID of the most recently active member.
     *
     * @return {string} ID of member
     */
    static getActiveMemberId() {
        const memberId = window.localStorage.activeMemberId;
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    /**
     * Save a member's keys.
     * @param {string} memberId - member Id
     * @param {Object} member - obj dict of keys { "LOW": {...}, "STANDARD": {...}, ... }
     */
    _saveMember(memberId, member) {
        this._checkSchemaVersion();
        var members;
        try {
            members = JSON.parse(window.localStorage.members);
        } catch (ex) {
            // oh well
        }
        if (!members) {
            members = {};
        }
        const memberCopy = {}; // like member, but Crypto.strKey( keys )
        for (const [level, key] of Object.entries(member)) {
            memberCopy[level] = Object.assign({}, key);
            if (key.publicKey) {
                memberCopy[level].publicKey = Crypto.strKey(key.publicKey);
            }
            if (key.secretKey) {
                memberCopy[level].secretKey = Crypto.strKey(key.secretKey);
            }
        }
        members[memberId] = memberCopy;
        window.localStorage.members = JSON.stringify(members);
    }

    /**
     * Load a member's keys.
     *
     * @param {string} memberId - ID of member
     * @return {Object} object dict level : key {"LOW": {...}, "STANDARD": {...}, ...}
     */
    _loadMember(memberId) {
        this._checkSchemaVersion();
        var members;
        try {
            members = JSON.parse(window.localStorage.members);
        } catch (ex) {
            return null;
        }
        if (!Object.prototype.hasOwnProperty.call(members, memberId)) {
            return null;
        }
        const member = members[memberId];
        for (const [level, key] of Object.entries(member)) {
            if (key.publicKey) {
                member[level].publicKey = Crypto.bufferKey(key.publicKey);
            }
            if (key.secretKey) {
                member[level].secretKey = Crypto.bufferKey(key.secretKey);
            }
        }
        return member;
    }
}

export default BrowserKeyStore;
