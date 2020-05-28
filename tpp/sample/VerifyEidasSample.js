import {TokenClient} from '../src';
import stringify from 'fast-json-stable-stringify';
import forge from 'node-forge';
import KeyStoreCryptoEngine from '../../core/src/security/engines/KeyStoreCryptoEngine';
import MemoryKeyStore from '../../core/src/security/engines/MemoryKeyStore';
const {ENV: TEST_ENV = 'dev'} = process.env;

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

    /**
     * Recovers a TPP member and verifies its EIDAS alias using eIDAS certificate.
     *
     * @param memberId id of the member to be recovered
     * @param tppAuthNumber authNumber of the TPP
     * @param certificate base64 encoded eIDAS certificate (a single line, no header and footer)
     * @param privateKey private key corresponding to the public key in the certificate
     * @returns verified business member.
     */
    static async recoverEidas(memberId, tppAuthNumber, certificate, privateKey) {
        const devKey = require('../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});
        const engine = new KeyStoreCryptoEngine(memberId, new MemoryKeyStore());
        const key = await engine.generateKey('PRIVILEGED');
        const payload = {
            memberId: memberId,
            certificate: certificate,
            algorithm: 'RS256',
            key: key,
        };
        const md = forge.md.sha256.create();
        md.update(stringify(payload), 'utf8');
        const signature = forge.util.encode64(privateKey.sign(md))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        const recoveredMember = await Token.recoverEidasMember(
            payload, signature, engine);
        const eidasAlias = {
            type: 'EIDAS',
            value: tppAuthNumber,
            realmId: recoveredMember._options.realmId,
        };
        const verifyPayload = {
            memberId: memberId,
            alias: eidasAlias,
            certificate: certificate,
            algorithm: 'RS256',
        };
        const md1 = forge.md.sha256.create();
        md1.update(stringify(verifyPayload), 'utf8');
        const signature1 = forge.util.encode64(privateKey.sign(md1))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        await recoveredMember.verifyEidas(verifyPayload, signature1);
        return recoveredMember;
    }

    /**
     * Creates a TPP member under realm of a bank and registers it with the provided eIDAS
     * certificate. The created member has a registered PRIVILEGED-level RSA key from the provided
     * certificate and an EIDAS alias with value equal to authNumber from the certificate.
     *
     * @param keyPair eIDAS key pair for the provided certificate
     * @param keyStore
     * @param bankId id of the bank the TPP trying to get access to
     * @param certificate base64 encoded eIDAS certificate (a single line, no header and footer)
     * @returns a newly created Member.
     */
    static async registerWithEidas(keyPair, keyStore, bankId, certificate) {
        const devKey = require('../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});
        const payload = {
            certificate: certificate,
            bankId: bankId,
        };
        // sign payload with the provided private key
        const md = forge.md.sha256.create();
        md.update(stringify(payload), 'utf8');
        const signature = forge.util.encode64(keyPair.privateKey.sign(md))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        const resp = await Token.registerWithEidas(payload, signature);
        keyStore.put(resp.memberId,
            await Token.Crypto.generateRsaKeys(keyPair, resp.keyId,'PRIVILEGED'));
        const member = await Token.getMember(Token.MemoryCryptoEngine, resp.memberId);
        const verificationStatus = await member.getEidasVerificationStatus(
            resp.verificationId);
        return member;
    }

    static generateCert(keys, authNumber) {
        const cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = `${Date.now()}`;
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        const attrs = [{
            name: 'commonName',
            value: 'Token.io',
        }, {
            name: 'countryName',
            value: 'UK',
        }, {
            name: 'id_at_organizationIdentifier',
            type: '2.5.4.97',
            value: authNumber,
        }];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        cert.setExtensions([{
            name: 'basicConstraints',
            cA: true,
        }, {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
        }, {
            name: 'extKeyUsage',
            serverAuth: true,
            clientAuth: true,
            codeSigning: true,
            emailProtection: true,
            timeStamping: true,
        }, {
            name: 'nsCertType',
            client: true,
            server: true,
            email: true,
            objsign: true,
            sslCA: true,
            emailCA: true,
            objCA: true,
        }]);

        // self-sign certificate
        cert.sign(keys.privateKey, forge.md.sha256.create());

        // PEM-format cert
        const certPem = forge.pki.certificateToPem(cert);
        const certDer = forge.pki.pemToDer(certPem);
        return forge.util.encode64(certDer.data);
    }
}

export default VerifyEidasSample;
