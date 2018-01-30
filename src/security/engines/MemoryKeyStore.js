const globalStorage = {};
class MemoryKeyStore {

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
            throw new Error("Invalid key structure: has no privilege level");
        }
        if (!globalStorage[memberId]) {
            globalStorage[memberId] = {};
        }
        globalStorage[memberId][keypair.level] = clone(keypair);
        globalStorage.ACTIVE = memberId;
        return clone(globalStorage[memberId][keypair.level]);
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
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
        }
        if (!globalStorage[memberId][level]) {
            throw new Error(`No key with level ${level} found`);
        }
        return clone(globalStorage[memberId][level]);
    }

    /**
     * Look up a key by memberId and keyId.
     *
     * @param {string} memberId - ID of member
     * @param {string} keyId - key ID
     * @return {Object} keypair
     */
    async getById(memberId, keyId) {
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
        }
        if (!keyId) {
            throw new Error(`Don't know id of key to get`);
        }
        for (let level in globalStorage[memberId]) {
            if (Object.prototype.hasOwnProperty.call(globalStorage[memberId], level)) {
                if (globalStorage[memberId][level].id === keyId) {
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
        return Object.keys(globalStorage[memberId]).map((level) => {
            return clone(globalStorage[memberId][level]);
        });
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
 * If the "user" of a keypair object edits it (e.g., deleting secretKey),
 * that shouldn't affect the "stored" keypair. Thus, we can't pass around
 * references to stored objects. Instead, we do some object-copying.
 *
 * @param {Object} obj - object to copy
 * @return {Object} copy of obj
 */
function clone(obj) {
    return Object.assign({}, obj);
}

export default MemoryKeyStore;
