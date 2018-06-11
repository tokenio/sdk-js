/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import MemberMethodsSample from '../../src/sample/MemberMethodsSample';
import TestUtil from '../TestUtil';

describe('MemberMethods test', () => {
    it('Should run the aliases sample', async () => {
        const TokenLib = require('../../src');
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenLib(TEST_ENV, devKey);

        const member = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
        });
        await MemberMethodsSample.aliases(Token, member);
        await TestUtil.waitUntil(async () => {
            const aliases = await member.aliases();
            assert.equal(aliases.length, 1);
            assert.isTrue(aliases[0].value.includes('alias4'));
        });
    });

    it('Should run the keys sample', async () => {
        const TokenLib = require('../../src');
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenLib(TEST_ENV, devKey);

        const member = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
        });
        await MemberMethodsSample.keys(Token, member);
    });

    it('Should run the addresses sample', async () => {
        const member = await CreateMemberSample();
        const addresses = await MemberMethodsSample.addresses(member);
        assert.equal(addresses.length, 1);
    });

    it('Should run the profiles sample', async () => {
        const member = await CreateMemberSample();
        const profile = await MemberMethodsSample.profiles(member);
        assert.isOk(profile);
        assert.isOk(profile.displayNameFirst);
        assert.isOk(profile.displayNameLast);
    });
});
