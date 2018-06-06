import base64Url from "base64url";
import stringify from "json-stable-stringify";
import {Buffer} from "buffer/.";

/**
 * Class providing static crypto primitives.
 */
class Crypto {
    /**
     * Generates a key pair to use with the Token system.
     *
     * @param {string} keyLevel - "LOW", "STANDARD", or "PRIVILEGED"
     * @param {boolean} extractable - whether the private key can be extracted from the CryptoKey object
     * @return {Object} generated key pair
     */
    static async generateKeys(keyLevel, extractable = false) {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            extractable,
            ['sign', 'verify'],
        );
        keyPair.publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
        if (extractable) {
            keyPair.privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        }
        keyPair.id = base64Url(await crypto.subtle.digest('SHA-256', keyPair.publicKey)).substring(0, 16);
        keyPair.algorithm = 'ECDSA_SHA256';
        keyPair.level = keyLevel;
        return keyPair;
    }

    /**
     * Signs a JSON object and returns the signature.
     *
     * @param {Object} json - object to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async signJson(json, keys) {
        return await Crypto.sign(stringify(json), keys);
    }

    /**
     * Signs a string and returns the signature.
     *
     * @param {string} message - message to sign
     * @param {Object} keys - keys to sign with
     * @return {string} signature
     */
    static async sign(message, keys) {
        const msg = Crypto.wrapBuffer(message);
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
        const derSig = Crypto._convertSigFormat(sig);
        return base64Url(derSig);
    }

    /**
     * Helper function for crypto engine createSigner:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generatekeys
     * @return {Object} signer object
     */
    static createSignerFromKeypair(keyPair) {
        return {
            sign: async (message) => {
                return await Crypto.sign(message, keyPair);
            },
            signJson: async (json) => {
                return await Crypto.signJson(json, keyPair);
            },
            getKeyId: () => keyPair.id
        };
    }

    /**
     * Verifies a signature on a JSON object. Throws if verification fails.
     *
     * @param {Object} json - JSON object to verify
     * @param {string} signature - signature to verify
     * @param {ArrayBuffer} publicKey - public key to use for verification
     */
    static async verifyJson(json, signature, publicKey) {
        await Crypto.verify(stringify(json), signature, publicKey);
    }

    /**
     * Verifies a signature on a string. Throws if verification fails.
     *
     * @param {string} message - string to verify
     * @param {string} signature - signature to verify
     * @param {ArrayBuffer} publicKey - public key to use for verification
     */
    static async verify(message, signature, publicKey) {
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
        const msg = Crypto.wrapBuffer(message);
        const sig = Crypto.wrapBuffer(base64Url.toBuffer(signature));
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
     * Helper function for crypto engine createVerifier:
     * returns a signer that uses a key pair.
     *
     * @param {Object} keyPair - such as returned by Token.Crypto.generatekeys, private key optional
     * @return {Object} verifier object
     */
    static createVerifierFromKeypair(keyPair) {
        return {
            verify: async (message, signature) => {
                return await Crypto.verify(message, signature, keyPair.publicKey);
            },
            verifyJson: async (json, signature) => {
                return await Crypto.verifyJson(json, signature, keyPair.publicKey);
            }
        };
    }

    /**
     * Converts a key to string.
     *
     * @param {ArrayBuffer} key - key to encode
     * @return {string} encoded key
     */
    static strKey(key) {
        return base64Url(key);
    }

    /**
     * Wraps buffer as an Uint8Array object.
     *
     * @param {string|Buffer} buffer - data
     * @return {Uint8Array} data in Uint8Array form
     */
    static wrapBuffer(buffer) {
        return new Uint8Array(new Buffer(buffer));
    }

    /**
     * Converts a key from a string to buffer.
     *
     * @param {string} key - base64Url encoded key
     * @return {Uint8Array} key in Uint8Array form
     */
    static bufferKey(key) {
        return Crypto.wrapBuffer(base64Url.toBuffer(key));
    }

    /**
     * Converts an ECDSA signature from P1363 to DER format
     *
     * @param {ArrayBuffer} sig - P1363 signature as an ArrayBuffer
     * @return {string} DER signature as an ArrayBuffer
     * @private
     */
    static _convertSigFormat(sig) {
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
        return (new Uint8Array(derSig.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)))).buffer;
    }
}

export default Crypto;
