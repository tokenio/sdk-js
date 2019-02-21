const MEMBER_KEY_DB = 'member_key';
const MEMBER_KEY_DB_VERSION = 1;
const MEMBER_KEY_STORE = 'member_keys';

const READ_ONLY = 'readonly';
const READ_WRITE = 'readwrite';

class BrowserKeyStore {
    /**
     * Keep track of the ID of the most recently active member.
     *
     * @param {string} memberId - ID of member
     */
    static setActiveMemberId(memberId) {
        localStorage.activeMemberId = memberId;
    }

    /**
     * Get the ID of the most recently active member.
     *
     * @return {string} ID of member
     */
    static getActiveMemberId() {
        const memberId = localStorage.activeMemberId;
        if (!memberId) {
            throw new Error('No active memberId on this browser');
        }
        return memberId;
    }

    /**
     * Store a member's key pair.
     *
     * @param {string} memberId - ID of member
     * @param {Object} keyPair - key pair to store
     * @return {Promise} promise that resolves into the key pair that was passed in
     */
    async put(memberId, keyPair) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keyPair) {
            throw new Error('Don\'t know what key to put');
        }
        if (!keyPair.level) {
            throw new Error('Don\'t know what level to put key');
        }
        if (keyPair.expiresAtMs < Date.now()) {
            throw new Error(`Key ${keyPair.id} has expired`);
        }
        const store = await BrowserKeyStore._getObjectStore(MEMBER_KEY_STORE, READ_WRITE);
        return new Promise((resolve, reject) => {
            const getReq = store.get(memberId);
            getReq.onsuccess = () => {
                const member = getReq.result || {};
                const putReq = store.put(
                    Object.assign(member, {[keyPair.level]: keyPair}),
                    memberId);
                putReq.onsuccess = () => {
                    BrowserKeyStore.setActiveMemberId(memberId);
                    resolve(keyPair);
                };
                putReq.onerror = () =>
                    reject(new Error(`Error saving member to database: ${putReq.error}`));
            };
            getReq.onerror = () =>
                reject(new Error(`Error getting member from database: ${getReq.error}`));
        });
    }

    /**
     * Look up a key by memberId and level.
     *
     * @param {string} memberId - ID of member
     * @param {string} level - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @return {Promise} promise that resolves into the retrieved key pair
     */
    async getByLevel(memberId, level) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!level) {
            throw new Error('Don\'t know what key level to get');
        }
        const store = await BrowserKeyStore._getObjectStore(MEMBER_KEY_STORE);
        return new Promise((resolve, reject) => {
            const getReq = store.get(memberId);
            getReq.onsuccess = () => {
                const member = getReq.result;
                if (!member) {
                    return reject(new Error(`Member with id ${memberId} not found`));
                }
                if (!member[level]) {
                    return reject(new Error(`No key with level ${level} found`));
                }
                if (member[level].expiresAtMs < Date.now()) {
                    return reject(new Error(`Key with level ${level} has expired`));
                }
                BrowserKeyStore.setActiveMemberId(memberId);
                resolve(getReq.result[level]);
            };
            getReq.onerror = () =>
                reject(new Error(`Error getting member from database: ${getReq.error}`));
        });
    }

    /**
     * Look up a key by memberId and keyId.
     *
     * @param {string} memberId - ID of member
     * @param {string} keyId - key ID
     * @return {Promise} promise that resolves into the retrieved key pair
     */
    async getById(memberId, keyId) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keyId) {
            throw new Error('Don\'t know id of key to get');
        }
        const store = await BrowserKeyStore._getObjectStore(MEMBER_KEY_STORE);
        return new Promise((resolve, reject) => {
            const getReq = store.get(memberId);
            getReq.onsuccess = () => {
                const member = getReq.result;
                if (!member) {
                    return reject(new Error(`member ${memberId} not found`));
                }
                Object.values(member).forEach(keyPair => {
                    if (keyPair.id === keyId) {
                        if (keyPair.expiresAtMs < Date.now()) {
                            reject(new Error(`Key with id ${keyPair.id} has expired`));
                        }
                        BrowserKeyStore.setActiveMemberId(memberId);
                        resolve(keyPair);
                    }
                });
                reject(new Error(`No key with id ${keyId} found`));
            };
            getReq.onerror = () =>
                reject(new Error(`Error getting member from database: ${getReq.error}`));
        });
    }

    /**
     * Return list of member's keys.
     *
     * @param {string} memberId - ID of member
     * @return {Promise} promise that resolves into the retrieved list of key pairs
     */
    async listKeys(memberId) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        const store = await BrowserKeyStore._getObjectStore(MEMBER_KEY_STORE);
        return new Promise((resolve, reject) => {
            const getReq = store.get(memberId);
            getReq.onsuccess = () => {
                const member = getReq.result;
                if (!member) {
                    return reject(new Error(`member ${memberId} not found`));
                }
                BrowserKeyStore.setActiveMemberId(memberId);
                resolve(Object.values(member)
                    .filter(keyPair => !(keyPair.expiresAtMs < Date.now())));
            };
            getReq.onerror = () =>
                reject(new Error(`Error getting member from database: ${getReq.error}`));
        });
    }

    /**
     * Clears all keys in object store
     *
     * @return {Promise<any>} promise that resolves when all keys have been cleared
     */
    async clearAllKeys() {
        const store = await BrowserKeyStore._getObjectStore(MEMBER_KEY_STORE, READ_WRITE);
        return new Promise((resolve, reject) => {
            const clearReq = store.clear();
            clearReq.onsuccess = () => resolve();
            clearReq.onerror = () =>
                reject(new Error(`Error clearing the database: ${clearReq.error}`));
        });
    }

    /**
     * Opens an instance of IndexedDB
     *
     * @param {string} dbName - name of db
     * @param {string} dbVersion - version of db
     * @return {Promise<IDBDatabase>} promise that resolves into the database object
     * @private
     */
    static async _openDb(dbName, dbVersion) {
        return new Promise((resolve, reject) => {
            if (!indexedDB) reject(new Error('Your browser does not support IndexedDB'));
            const openReq = indexedDB.open(dbName, dbVersion);
            openReq.onsuccess = () => {
                resolve(openReq.result);
            };
            openReq.onerror = () => reject(new Error(`Error opening database: ${openReq.error}`));
            openReq.onupgradeneeded = e => {
                const db = e.target.result;
                db.createObjectStore(MEMBER_KEY_STORE);
            };
        });
    }

    /**
     * Retrieves an object store from the db
     *
     * @param {string} storeName - name of object store
     * @param {string} mode - readonly, readwrite, or readwriteflush, defaults to readonly
     * @return {Promise<IDBObjectStore>} promise that resolves into the store object
     * @private
     */
    static async _getObjectStore(storeName, mode = READ_ONLY) {
        const db = await BrowserKeyStore._openDb(MEMBER_KEY_DB, MEMBER_KEY_DB_VERSION);
        const txn = db.transaction(storeName, mode);
        txn.oncomplete = () => db.close();
        txn.onerror = () => {
            throw new Error(`Error opening transaction: ${txn.error}`);
        };
        return txn.objectStore(storeName);
    }
}

export default BrowserKeyStore;
