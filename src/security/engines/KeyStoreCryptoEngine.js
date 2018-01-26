import Crypto from '../Crypto';

class KeyStoreCryptoEngine {
    constructor(memberId, keystore) {
        console.log("CE.constructor");
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keystore) {
            throw new Error('Invalid keystore');
        }
        this._memberId = memberId;
        this._keystore = keystore;
        this.setActiveMemberId(memberId);
    }
    async getActiveMemberId() {
        console.log("CE.getActive");
        if (this._keystore.getActiveMemberId) {
            return await this._keystore.getActiveMemberId();
        }
        throw new Error('keystore does not support "active member"');
    }
    async setActiveMemberId() {
        console.log("CE.setActive");
        if (this._keystore.setActiveMemberId) {
            await this._keystore.setActiveMemberId();
        }
    }
    async generateKey(level) {
        console.log("CE.generateKey", level);
        const keypair = Crypto.generateKeys(level);
        var stored = await this._keystore.put(this._memberId, keypair);
        if (stored && stored.secretKey) {
            delete stored.secretKey;
        }
        return stored;
    }
    async createSigner(level) {
        console.log("CE.createSigner", this._memberId, level);
        const keypair = await this._keystore.getByLevel(this._memberId, level);
        return Crypto.createSignerFromKeypair(keypair);
    }
    async createVerifier(keyId) {
        console.log("CE.createVerifier", this._memberId, keyId);
        const keypair = await this._keystore.getById(this._memberId, keyId);
        return Crypto.createVerifierFromKeypair(keypair);
    }
}

export default KeyStoreCryptoEngine;
