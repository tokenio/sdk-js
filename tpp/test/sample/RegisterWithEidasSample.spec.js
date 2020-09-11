import TestUtil from '../TestUtil';
import Util from '../../src/Util';
import RegisterWithEidasSample from '../../sample/RegisterWithEidasSample';
const forge = require('node-forge');
const {assert} = require('chai');

describe('RegisterWithEidasSample test', () => {
    it('Should create, onboard and log-in a business member', async () => {
        // generate: TPP authNumber, a key pair and an eIDAS certificate for the generated key
        const tppAuthNumber = Util.generateNonce();
        const pspSubjectName = Util.generateNonce();
        const keyPair = forge.pki.rsa.generateKeyPair(2048, 0x10001);
        const certificate = await TestUtil.generateEidasCertificate(keyPair, tppAuthNumber, pspSubjectName);

        // create and onboard a member
        const member = await RegisterWithEidasSample.registerWithEidas('gold', certificate, keyPair.privateKey);
        const aliases = await member.aliases();
        assert.equal(aliases.length, 1);
        assert.equal(aliases[0].value, tppAuthNumber);
        assert.equal(aliases[0].type, 'EIDAS');
        const profile = await member.getProfile(member.memberId());
        assert.equal(profile.displayNameFirst, pspSubjectName);
        const keys = await member.keys();
        assert.equal(keys.length, 1);
    });
});