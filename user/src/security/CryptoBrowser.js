import {base64Url} from '@token-io/core';
import Util from '../Util';
import stringify from 'fast-json-stable-stringify';

const crypto = window.crypto;

// supported algorithms
const ECDSA = 'ECDSA_SHA256';
const RSA = 'RS256';

// default to ECDSA and fallback to RSA
let algorithm = Util.isFirefox || Util.isEdge()
    ? RSA
    : ECDSA;

/**
 * Class providing static crypto primitives for the browser using Web Cryptography API.
 */
class CryptoBrowser {
    /**
     * Generates a key pair to use with the Token system.
     *
     * @param {string} keyLevel - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @param {string} expirationMs - (optional) expiration duration of the key in milliseconds
     * @param {boolean} extractable - whether the private key can be extracted into raw data
     * @return {Object} generated key pair
     */
    static async generateKeys(keyLevel, expirationMs, extractable = false) {
        const keyPair = await CryptoBrowser._generateKeyPair(extractable);
        keyPair.level = keyLevel;
        if (expirationMs !== undefined)
            keyPair.expiresAtMs = ((new Date()).getTime() + expirationMs).toString();
        return keyPair;
    }

    /**
     * Signs a json object and returns the signature
     *
     * @param {Object} json - object to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async signJson(json, keys) {
        return await CryptoBrowser.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature.
     *
     * @param {string} message - message to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async sign(message, keys) {
        let importedPrivateKey = keys.privateKey;
        if (!(keys.privateKey.constructor.name === 'CryptoKey')) {
            importedPrivateKey = await crypto.subtle.importKey(
                'jwk',
                keys.privateKey,
                CryptoBrowser[algorithm].import,
                false,
                ['sign']
            );
        }
        let sig = new Uint8Array(await crypto.subtle.sign(
            CryptoBrowser[algorithm].sign,
            importedPrivateKey,
            Util.wrapBuffer(message)
        ));
        if (algorithm === ECDSA) sig = CryptoBrowser._P1363ToDer(sig);
        return base64Url(sig);
    }

    /**
     * Helper function for crypto engine createSigner:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generateKeys
     * @return {Object} signer object
     */
    static createSignerFromKeyPair(keyPair) {
        return {
            sign: async message => {
                return await CryptoBrowser.sign(message, keyPair);
            },
            signJson: async json => {
                return await CryptoBrowser.signJson(json, keyPair);
            },
            getKeyId: () => keyPair.id,
        };
    }

    /**
     * Verifies a signature on a JSON object. Throws if verification fails.
     *
     * @param {Object} json - JSON object to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static async verifyJson(json, signature, publicKey) {
        await CryptoBrowser.verify(stringify(json), signature, publicKey);
    }

    /**
     * Verifies a signature on a string. Throws if verification fails.
     *
     * @param {string} message - string to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static async verify(message, signature, publicKey) {
        signature = Util.bufferKey(signature);
        if (algorithm === ECDSA) signature = CryptoBrowser._DerToP1363(signature);
        const importedPublicKey = await crypto.subtle.importKey(
            'spki',
            publicKey,
            CryptoBrowser[algorithm].import,
            false,
            ['verify']
        );
        const result = await crypto.subtle.verify(
            CryptoBrowser[algorithm].verify,
            importedPublicKey,
            signature,
            Util.wrapBuffer(message)
        );
        if (!result) {
            throw new Error(
                `Invalid signature ${signature} on message ${message} with pk ${publicKey}`);
        }
    }

    /**
     * Helper function for crypto engine createVerifier:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generateKeys, only public key
     * @return {Object} verifier object
     */
    static createVerifierFromKeyPair(keyPair) {
        return {
            verify: async (message, signature) => {
                return await CryptoBrowser.verify(message, signature, keyPair.publicKey);
            },
            verifyJson: async (json, signature) => {
                return await CryptoBrowser.verifyJson(json, signature, keyPair.publicKey);
            },
        };
    }

    static get [ECDSA]() {
        const ao = {}; // algorithm options
        ao.generate = ao.import = {
            name: 'ECDSA',
            namedCurve: 'P-256', // can be 'P-256', 'P-384', or 'P-521'
        };
        ao.sign = ao.verify = {
            name: 'ECDSA',
            hash: {name: 'SHA-256'}, // can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        };
        return ao;
    }

    static get [RSA]() {
        const ao = {};
        ao.generate = {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048, // can be 1024, 2048, or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: 'SHA-256'}, // can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        };
        ao.import = ao.sign = ao.verify = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: {name: 'SHA-256'}, // can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        };
        return ao;
    }

    static async _generateKeyPair(extractable) {
        let keyPair;
        try {
            keyPair = await crypto.subtle.generateKey(
                CryptoBrowser[algorithm].generate,
                extractable,
                ['sign', 'verify'],
            );
        } catch (e) {
            algorithm = RSA;
            keyPair = await crypto.subtle.generateKey(
                CryptoBrowser[algorithm].generate,
                extractable,
                ['sign', 'verify'],
            );
        }
        keyPair = {publicKey: keyPair.publicKey, privateKey: keyPair.privateKey}; // for MS Edge
        if (extractable) {
            keyPair.privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
        }
        keyPair.publicKey = new Uint8Array(
            await crypto.subtle.exportKey('spki', keyPair.publicKey));
        keyPair.id = base64Url(await crypto.subtle.digest('SHA-256', keyPair.publicKey))
            .substring(0, 16);
        keyPair.algorithm = algorithm;
        return keyPair;
    }

    /**
     * Converts an ECDSA signature from P1363 to DER format
     *
     * @param {Uint8Array} sig - P1363 signature
     * @return {Uint8Array} DER signature
     * @private
     */
    static _P1363ToDer(sig) {
        const signature = Array.from(sig, x => ('00' + x.toString(16)).slice(-2)).join('');
        let r = signature.substr(0, signature.length / 2);
        let s = signature.substr(signature.length / 2);
        r = r.replace(/^(00)+/, '');
        s = s.replace(/^(00)+/, '');
        if ((parseInt(r, 16) & '0x80') > 0) r = `00${r}`;
        if ((parseInt(s, 16) & '0x80') > 0) s = `00${s}`;
        const rString = `02${(r.length / 2).toString(16).padStart(2, '0')}${r}`;
        const sString = `02${(s.length / 2).toString(16).padStart(2, '0')}${s}`;
        const derSig = `30${((rString.length + sString.length) / 2)
            .toString(16).padStart(2, '0')}${rString}${sString}`;
        return new Uint8Array(derSig.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
    }

    /**
     * Converts an ECDSA signature from DER to P1363 format
     *
     * @param {Uint8Array} sig - DER signature
     * @return {Uint8Array} P1363 signature
     * @private
     */
    static _DerToP1363(sig) {
        const signature = Array.from(sig, x => ('00' + x.toString(16)).slice(-2)).join('');
        const rLength = parseInt(signature.substr(6, 2), 16) * 2;
        let r = signature.substr(8, rLength);
        let s = signature.substr(12 + rLength);
        r = r.length > 64 ? r.substr(-64) : r.padStart(64, '0');
        s = s.length > 64 ? s.substr(-64) : s.padStart(64, '0');
        const p1363Sig = `${r}${s}`;
        return new Uint8Array(p1363Sig.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
    }
}

export default CryptoBrowser;
