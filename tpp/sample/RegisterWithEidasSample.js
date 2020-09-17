import {TokenClient} from '../src';
import CryptoRsa from '../../core/src/security/CryptoRsa';
import {getPublicKey} from '../test/TestUtil';
import ManualCryptoEngine from '../../core/src/security/engines/ManualCryptoEngine';

class RegisterWithEidasSample {
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
}

export default RegisterWithEidasSample;
