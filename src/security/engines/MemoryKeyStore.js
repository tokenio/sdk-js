const globalStorage = {};

class MemoryKeyStore {

    /**
     * Store a member's key pair.
     *
     * @param {string} memberId - ID of member
     * @param {Object} keyPair - key pair to store
     * @return {Object} the stored key pair
     */
    async put(memberId, keyPair) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keyPair) {
            throw new Error('Don\'t know what key to put');
        }
        if (!keyPair.level) {
            throw new Error('Invalid key structure: has no privilege level');
        }
        if (keyPair.expiresAtMs < Date.now()) {
            throw new Error(`Key ${keyPair.id} has expired`);
        }
        if (!globalStorage[memberId]) {
            globalStorage[memberId] = {};
        }
        globalStorage[memberId][keyPair.level] = clone(keyPair);
        globalStorage.ACTIVE = memberId;
        return clone(globalStorage[memberId][keyPair.level]);
    }

    /**
     * Look up a key by memberId and level.
     *
     * @param {string} memberId - ID of member
     * @param {string} level - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @return {Object} key pair
     */
    async getByLevel(memberId, level) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!level) {
            throw new Error('Don\'t know what key level to get');
        }
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
        }
        if (!globalStorage[memberId][level]) {
            throw new Error(`No key with level ${level} found`);
        }
        if (globalStorage[memberId][level].expiresAtMs < Date.now()) {
            throw new Error(`Key with level ${level} has expired`);
        }
        return clone(globalStorage[memberId][level]);
    }

    /**
     * Look up a key by memberId and keyId.
     *
     * @param {string} memberId - ID of member
     * @param {string} keyId - key ID
     * @return {Object} key pair
     */
    async getById(memberId, keyId) {
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
        }
        if (!keyId) {
            throw new Error('Don\'t know id of key to get');
        }
        for (const level in globalStorage[memberId]) {
            if (Object.prototype.hasOwnProperty.call(globalStorage[memberId], level)) {
                if (globalStorage[memberId][level].id === keyId) {
                    if (globalStorage[memberId][level].expiresAtMs < Date.now()) {
                        throw new Error(
                            'Key with id ${globalStorage[memberId][level].id} has expired');
                    }
                    return clone(globalStorage[memberId][level]);
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
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
        }
        return Object.keys(globalStorage[memberId])
            .map(level => clone(globalStorage[memberId][level]))
            .filter(keyPair => !(keyPair.expiresAtMs < Date.now()));
    }

    /**
     * Keep track of the ID of the most recently active member.
     *
     * @param {string} memberId - ID of member
     */
    static setActiveMemberId(memberId) {
        globalStorage.ACTIVE = memberId;
    }

    /**
     * Get the ID of the most recently active member.
     *
     * @return {string} ID of member
     */
    static getActiveMemberId() {
        const memberId = globalStorage.ACTIVE;
        if (!memberId) {
            throw new Error('No active memberId');
        }
        return memberId;
    }
}

/**
 * Return a (shallow) copy of an object.
 *
 * If the 'user' of a key pair object edits it (e.g., deleting privateKey),
 * that shouldn't affect the 'stored' key pair. Thus, we can't pass around
 * references to stored objects. Instead, we do some object-copying.
 *
 * @param {Object} obj - object to copy
 * @return {Object} copy of obj
 */
function clone(obj) {
    return Object.assign({}, obj);
}

export default MemoryKeyStore;
