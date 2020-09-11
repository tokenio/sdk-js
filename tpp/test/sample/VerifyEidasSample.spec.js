import VerifyEidasSample from '../../sample/VerifyEidasSample';
import TestUtil from '../TestUtil';
import Util from '../../src/Util';
const forge = require('node-forge');
const {assert} = require('chai');

describe('VerifyEidasSample test', () => {
    it('Should create and verify business member', async () => {
        // generate: TPP authNumber, a key pair and an eIDAS certificate for the generated key
        const tppAuthNumber = Util.generateNonce();
        const pspSubjectName = Util.generateNonce();
        const keyPair = forge.pki.rsa.generateKeyPair(2048, 0x10001);
        const certificate = await TestUtil.generateEidasCertificate(keyPair, tppAuthNumber, pspSubjectName);

        // create and onboard a member
        const member = await VerifyEidasSample.verifyEidas(
            certificate, tppAuthNumber, 'gold', keyPair.privateKey);
        const aliases = await member.aliases();
        assert.equal(aliases.length, 1);
        assert.equal(aliases[0].value, tppAuthNumber);
        assert.equal(aliases[0].type, 'EIDAS');
        const profile = await member.getProfile(member.memberId());
        assert.equal(profile.displayNameFirst, pspSubjectName);
    });
});
