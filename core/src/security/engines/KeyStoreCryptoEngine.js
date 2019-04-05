// @flow
import Crypto from '../Crypto';
import Util from '../../Util';
import type {KeyLevel} from '../..';

/**
 * Base crypto engine that are extended by others.
 * It handles signatures, verifications, and key storage.
 */
export class KeyStoreCryptoEngine {
    _memberId: string;
    _keystore: Object;
    _crypto: Object;
    static getActiveMemberId: () => string;

    constructor(
        memberId: string,
        keystore?: Object,
        crypto?: Object = Crypto
    ) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keystore) {
            throw new Error('Invalid keystore');
        }
        this._memberId = memberId;
        this._keystore = keystore;
        this._crypto = crypto;
        if (memberId && keystore.constructor.setActiveMemberId) {
            keystore.constructor.setActiveMemberId(memberId);
        }
    }

    /**
     * Generates a key pair and store it.
     *
     * @param level - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @param expirationMs - (optional) expiration duration of the key in milliseconds
     * @return key in proto-compliant format
     */
    async generateKey(level: KeyLevel, expirationMs?: number | string): Object {
        const keyPair = await this._crypto.generateKeys(level, expirationMs);
        const stored = await this._keystore.put(this._memberId, keyPair);
        stored.publicKey = Util.strKey(stored.publicKey);
        delete stored.privateKey;
        return stored;
    }

    /**
     * Creates a signer. Assumes we previously generated the relevant key.
     *
     * @param level - privilege level 'LOW', 'STANDARD', 'PRIVILEGED'
     * @return signer object that implements sign, signJson, and getKeyId
     */
    async createSigner(level: KeyLevel): Object {
        const keyPair = await this._keystore.getByLevel(this._memberId, level);
        return this._crypto.createSignerFromKeyPair(keyPair);
    }

    /**
     * Creates a verifier. Assumes we have the key with the passed ID.
     *
     * @param keyId - ID of key to use
     * @return verifier object that implements verify and verifyJson
     */
    async createVerifier(keyId: string): Object {
        const keyPair = await this._keystore.getById(this._memberId, keyId);
        return this._crypto.createVerifierFromKeyPair(keyPair);
    }
}

export default KeyStoreCryptoEngine;
