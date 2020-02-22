import {TokenClient} from '../src';
import stringify from 'fast-json-stable-stringify';
import forge from 'node-forge';

class VerifyEidasSample {
    /**
    * Create and verify member with eIDAS certificate.
     *
     * @param {string} certificate - base64 encoded eIDAS certificate (with RSA key in this sample)
     * @param {string} tppAuthNumber authNumber of the TPP
     * @param {string} bankId ID of the bank the TPP trying to get access to
     * @param {Object} privateKey - private key corresponding to the public key in the certificate
     * @return tpp member verified with eIDAS certificate
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

export default VerifyEidasSample;
