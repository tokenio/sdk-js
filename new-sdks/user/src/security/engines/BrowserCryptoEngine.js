import {KeyStoreCryptoEngine} from '@token-io/core';
import BrowserKeyStore from './BrowserKeyStore';
import CryptoBrowser from '../CryptoBrowser';
import Util from '../../Util';

/**
 * Crypto engine for the browser, it handles signatures, verifications,
 * and keys are stored in IndexedDB using the following schema
 *
 * KEY: memberId (e.g. 'm:12345:678')
 * VALUE (JS object):
 * {
 *      LOW: {
 *          ID: 456,
 *          algorithm: ECDSA,
 *          level: LOW,
 *          publicKey: key data in Uint8Array format
 *          privateKey: non-extractable object
 *      },
 *      STANDARD: {...},
 *      PRIVILEGED: {...},
 * }
 *
 * Furthermore, activeMemberId is stored in localStorage
 */
const globalKeyStore = new BrowserKeyStore();

class BrowserCryptoEngine extends KeyStoreCryptoEngine {
    /**
     * Constructs the engine, using an existing member/keys if it is in localStorage
     *
     * @param {string} memberId - memberId of the member we want to create the engine for
     */
    constructor(memberId) {
        super(memberId, globalKeyStore, !Util.isIE11() && CryptoBrowser);
    }

    static getActiveMemberId() {
        return BrowserKeyStore.getActiveMemberId();
    }

    static setActiveMemberId(memberId) {
        BrowserKeyStore.setActiveMemberId(memberId);
    }

    static async clearAllKeys() {
        return await globalKeyStore.clearAllKeys();
    }
}

export default BrowserCryptoEngine;
