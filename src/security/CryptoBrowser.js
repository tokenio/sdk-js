import base64Url from "base64url";
import {Buffer} from 'buffer';

let crypto = BROWSER && (window.crypto || window.msCrypto);

/**
 * Class providing static crypto primitives for the browser using Web Cryptography API.
 */
class CryptoBrowser {
    /**
     * Generates a key pair to use with the Token system.
     *
     * @param {string} keyLevel - "LOW", "STANDARD", or "PRIVILEGED"
     * @param {string} expirationMs - (optional) expiration date of the key in milliseconds
     * @param {boolean} extractable - whether the private key can be extracted into raw data
     * @return {Object} generated key pair
     */
    static async generateKeys(keyLevel, expirationMs, extractable = false) {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            extractable,
            ['sign', 'verify'],
        );
        keyPair.publicKey = new Uint8Array(await crypto.subtle.exportKey('spki', keyPair.publicKey));
        if (extractable) {
            keyPair.privateKey = new Uint8Array(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey));
        }
        keyPair.id = base64Url(await crypto.subtle.digest('SHA-256', keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ECDSA_SHA256';
        keyPair.level = keyLevel;
        if (expirationMs !== undefined) keyPair.expiresAtMs = expirationMs;
        return keyPair;
    }

    /**
     * Signs a string and returns the signature.
     *
     * @param {string} message - message to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async sign(message, keys) {
        const msg = CryptoBrowser.wrapBuffer(message);
        let importedPrivateKey = keys.privateKey;
        if (!importedPrivateKey instanceof CryptoKey) {
            importedPrivateKey = await crypto.subtle.importKey(
                'pkcs8',
                importedPrivateKey,
                {
                    name: 'ECDSA',
                    namedCurve: 'P-256',
                },
                false,
                ['sign']
            );
        }
        const sig = await crypto.subtle.sign(
            {
                name: 'ECDSA',
                hash: {name: 'SHA-256'},
            },
            importedPrivateKey,
            msg
        );
        const derSig = CryptoBrowser._P1363ToDer(sig);
        return base64Url(derSig);
    }

    /**
     * Verifies a signature on a string. Throws if verification fails.
     *
     * @param {string} message - string to verify
     * @param {string} signature - signature to verify
     * @param {Uint8Array} publicKey - public key to use for verification
     */
    static async verify(message, signature, publicKey) {
        const msg = CryptoBrowser.wrapBuffer(message);
        const importedPublicKey = await crypto.subtle.importKey(
            'spki',
            publicKey,
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            false,
            ['verify']
        );
        const sig = CryptoBrowser._DerToP1363(CryptoBrowser.bufferKey(signature));
        const result = await crypto.subtle.verify(
            {
                name: 'ECDSA',
                hash: {name: 'SHA-256'},
            },
            importedPublicKey,
            sig,
            msg
        );
        if (!result) {
            throw new Error(
                `Invalid signature ${signature} on message ${message} with pk ${publicKey}`);
        }
    }

    /**
     * Converts an ECDSA signature from P1363 to DER format
     *
     * @param {ArrayBuffer} sig - P1363 signature
     * @return {Uint8Array} DER signature
     * @private
     */
    static _P1363ToDer(sig) {
        const signature = Array.from(new Uint8Array(sig), (x) => ('00' + x.toString(16)).slice(-2)).join('');
        let r = signature.substr(0, signature.length / 2);
        let s = signature.substr(signature.length / 2);
        r = r.replace(/^(00)+/, '');
        s = s.replace(/^(00)+/, '');
        if ((parseInt(r, 16) & '0x80') > 0) r = `00${r}`;
        if ((parseInt(s, 16) & '0x80') > 0) s = `00${s}`;
        const rString = `02${(r.length / 2).toString(16).padStart(2, '0')}${r}`;
        const sString = `02${(s.length / 2).toString(16).padStart(2, '0')}${s}`;
        const derSig = `30${((rString.length + sString.length) / 2).toString(16).padStart(2, '0')}${rString}${sString}`;
        return new Uint8Array(derSig.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));
    }

    /**
     * Converts an ECDSA signature from DER to P1363 format
     *
     * @param {ArrayBuffer} sig - DER signature
     * @return {Uint8Array} P1363 signature
     * @private
     */
    static _DerToP1363(sig) {
        const signature = Array.from(new Uint8Array(sig), (x) => ('00' + x.toString(16)).slice(-2)).join('');
        const rLength = parseInt(signature.substr(6, 2), 16) * 2;
        let r = signature.substr(8, rLength);
        let s = signature.substr(12 + rLength);
        r = r.length > 64 ? r.substr(-64) : r.padStart(64, '0');
        s = s.length > 64 ? s.substr(-64) : s.padStart(64, '0');
        const p1363Sig = `${r}${s}`;
        return new Uint8Array(p1363Sig.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));
    }

    /**
     * Converts a key to string.
     *
     * @param {Uint8Array} key - key to encode
     * @return {string} encoded key
     */
    static strKey(key) {
        return base64Url(key);
    }

    /**
     * Wraps buffer as an Uint8Array object.
     *
     * @param {string|Buffer} buffer - data
     * @return {Uint8Array} data
     */
    static wrapBuffer(buffer) {
        return new Uint8Array(new Buffer(buffer));
    }

    /**
     * Converts a key from a string to buffer.
     *
     * @param {string} key - base64Url encoded key
     * @return {Uint8Array} buffered key
     */
    static bufferKey(key) {
        return CryptoBrowser.wrapBuffer(base64Url.toBuffer(key));
    }
}

export default CryptoBrowser;
