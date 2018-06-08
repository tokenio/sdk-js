/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import ProvisionDeviceSample from '../../src/sample/ProvisionDeviceSample';
import TestUtil from '../TestUtil';

describe('ProvisionDeviceSample test', () => {
    if (!BROWSER) {
        it('ProvisionDeviceSample should run', async () => {
            const member = await CreateMemberSample();
            await TestUtil.waitUntil(async () => {
                assert.isOk(await member.firstAlias());
            });
            await member.subscribeToNotifications("iron");
            const alias = await member.firstAlias();

            const devKey = require("../../src/config.json").devKey[TEST_ENV];
            const TokenLib = require('../../src');
            const Token = new TokenLib(TEST_ENV, devKey, './keys');
            const key = await ProvisionDeviceSample.provision(Token, alias);
            await member.approveKey(key);

            const localLoggedIn = await ProvisionDeviceSample.getMember(Token, alias);
            assert.equal(member.memberId(), localLoggedIn.memberId());
        });
    }
});
