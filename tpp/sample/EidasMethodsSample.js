import {TokenClient} from '../src';
import stringify from 'fast-json-stable-stringify';
import forge from 'node-forge';
import CryptoRsa from '../../core/src/security/CryptoRsa';
import {getPublicKey} from '../test/TestUtil';
import ManualCryptoEngine from '../../core/src/security/engines/ManualCryptoEngine';

class EidasMethodsSample {
    /**
     * Create and onboard member with eIDAS certificate.
     *
     * @param {string} certificate - base64 encoded eIDAS certificate
     * @param {string} bankId ID of the bank the TPP trying to get access to
     * @param {Object} privateKey - private key corresponding to the public key in the certificate
     * @return tpp member onboarded with an eIDAS certificate
     */
    static async registerWithEidas(bankId, certificate, privateKey) {
        // Initialize SDK:
        // 'sandbox' is a good value for TEST_ENV here.
        const devKey = require('../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});

        // construct a payload with all the required data
        const payload = {
            bankId: bankId,
            certificate: certificate,
        };
        // sign the payload with the certificate private key
        const keyPair = {
            algorithm: 'RS256',
            level: 'PRIVILEGED',
            privateKey: privateKey,
            publicKey: getPublicKey(certificate),
        };
        const signer = await CryptoRsa.createSignerFromKeyPair(keyPair);
        const signature = await signer.signJson(payload);

        // register with the eidas certificate
        const response = await Token.registerWithEidas(payload, signature);

        // now we can log-in the member using the eidas key pair
        const memberId = response.memberId;
        // make sure to set the keyId returned by the call
        keyPair.id = response.keyId;
        await ManualCryptoEngine.setKeys([keyPair]);

        return Token.getMember(ManualCryptoEngine, memberId);
    }

    /**
     * Create and onboard a member with eIDAS certificate.
     *
     * @param {string} certificate - base64 encoded eIDAS certificate
     * @param {string} tppAuthNumber authNumber of the TPP
     * @param {string} bankId ID of the bank the TPP trying to get access to
     * @param {Object} privateKey - RSA private key corresponding to the public key in the certificate
     * @return tpp member onboarded with eIDAS certificate
     */
    static async verifyEidas(certificate, tppAuthNumber, bankId, privateKey) {
        // Initialize SDK:
        // 'sandbox' is a good value for TEST_ENV here.
        const devKey = require('../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});
        // resolve memberId of the bank TPP is trying to get access to
        const bankMember = await Token.resolveAlias({
            type: 'BANK',
            value: bankId,
        });
        const realmId = bankMember.id;
        // create an eIDAS alias under realm of the target bank
        const eidasAlias = {
            type: 'EIDAS',
            value: tppAuthNumber,
            realmId: realmId,
        };
        // create a member under realm of the bank with eIDAS alias
        const tpp = await Token.createMember(
            eidasAlias,
            Token.MemoryCryptoEngine,
            realmId
        );
        // construct a payload with all the required data
        const payload = {
            memberId: tpp.memberId(),
            alias: eidasAlias,
            certificate: certificate,
            algorithm: 'RS256',
        };
        // sign payload with the provided private key
        const md = forge.md.sha256.create();
        md.update(stringify(payload), 'utf8');
        const signature = forge.util.encode64(privateKey.sign(md))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        // verify eIDAS
        const response = await tpp.verifyEidas(payload, signature);
        // get the verification status (useful if verifyEidas returned IN_PROGRESS status)
        const verificationStatus = await tpp.getEidasVerificationStatus(response.verificationId);
        return tpp;
    }
}

export default EidasMethodsSample;
