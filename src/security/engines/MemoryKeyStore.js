const globalStorage = {};
class MemoryKeyStore {
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
    async getByLevel(memberId, level) {
        console.log("MKS.getByLevel", memberId, level);
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
    async getById(memberId, keyId) {
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
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
    async listKeys(memberId) {
        if (!globalStorage[memberId]) {
            throw new Error(`member ${memberId} not found`);
        }
        return Object.keys(globalStorage[memberId]).map((level) => {
            return clone(globalStorage[memberId][level]);
        });
    }

    static setActiveMemberId(memberId) {
        globalStorage.ACTIVE = memberId;
    }

    static getActiveMemberId() {
        return globalStorage.ACTIVE;
    }
}

/**
 * Return a copy of an object.
 *
 * If the "user" of a keypair object edits it (e.g., deleting secretKey),
 * that shouldn't affect the "stored" keypair. Thus, we can't pass around
 * references to stored objects. Instead, we do lots of object-copying.
 *
 * @param {Object} obj - object to copy
 * @return {Object} copy of obj
 */
function clone(obj) {
    return Object.assign({}, obj);
}

export default MemoryKeyStore;
