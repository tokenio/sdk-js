import VerifyEidasSample from '../../sample/VerifyEidasSample';
import forge from 'node-forge';
const {assert} = require('chai');
import Util from '../../src/Util';
import MemoryKeyStore from '../../../core/src/security/engines/MemoryKeyStore';

describe('VerifyEidasSample test', () => {
    it('Should create and verify business member', async () => {
        const keyPair = forge.pki.rsa.generateKeyPair();
        const tppAuthNumber = Util.generateNonce();
        const certificate = VerifyEidasSample.generateCert(keyPair, tppAuthNumber);
        const member = await VerifyEidasSample.verifyEidas(
            certificate, tppAuthNumber, 'gold', keyPair.privateKey);
        const aliases = await member.aliases();
        assert.equal(aliases.length, 1);
        assert.equal(aliases[0].value, tppAuthNumber);
        assert.equal(aliases[0].type, 'EIDAS');
        const eidasInfo = await member.getEidasCertificateStatus();
        assert.equal(eidasInfo.certificate, certificate);
        assert.equal(eidasInfo.status, 'CERTIFICATE_VALID');
        // remove the alias from the member, so it can be re-used next time the test is run
        await member.removeAlias(aliases[0]);
    });

    it('recover and verify business member', async () => {
        const keyPair = forge.pki.rsa.generateKeyPair();
        const tppAuthNumber = Util.generateNonce();
        const cert = VerifyEidasSample.generateCert(keyPair, tppAuthNumber);
        const verifiedTppMember = await VerifyEidasSample.verifyEidas(
            cert, tppAuthNumber, 'gold', keyPair.privateKey);
        const recoveredMember = await VerifyEidasSample.recoverEidas(
            verifiedTppMember._id, tppAuthNumber, cert, keyPair.privateKey);
        const verifiedAliases = await recoveredMember.aliases();
        assert.equal(verifiedAliases.length, 1);
        assert.equal(verifiedAliases[0].value, tppAuthNumber);
        assert.equal(verifiedAliases[0].type, 'EIDAS');
    });

    it('member should register with eidas cert', async () => {
        const keyStore = new MemoryKeyStore();
        const keyPair = forge.pki.rsa.generateKeyPair();
        const authNumber = Util.generateNonce();
        const cert = VerifyEidasSample.generateCert(keyPair, authNumber);
        const member = await VerifyEidasSample.registerWithEidas(keyPair,
            keyStore,'gold', cert);
        const aliases = await member.aliases();
        const keys = await member.keys();
        const publicKeyDer = forge.pki.pemToDer(
            forge.pki.publicKeyToPem(keyPair.publicKey));
        const publicKey = forge.util.encode64(publicKeyDer.data)
            .replace(/\+/g, '-').replace(/\//g, '_');
        assert.equal(keys[0].publicKey, publicKey);
        assert.equal(keys[0].level, 'PRIVILEGED');
        assert.equal(aliases[0].value, authNumber);
    });
});
