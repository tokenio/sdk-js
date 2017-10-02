/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import ProvisionDeviceSample from '../../src/sample/ProvisionDeviceSample';

describe('ProvisionDeviceSample test', () => {
    if (!BROWSER) {
        it('ProvisionDeviceSample should run', async () => {
            const TokenLib = require('../../src');
            const Token = new TokenLib(TEST_ENV, './keys');
            const member = await CreateMemberSample();
            await member.subscribeToNotifications("iron");
            const alias = {
                type: 'USERNAME',
                value: await member.firstAlias()
            };
            const key = await ProvisionDeviceSample.provision(Token, alias);
            await member.approveKey(key);

            const localLoggedIn = await ProvisionDeviceSample.login(Token, alias);
            assert.equal(member.memberId(), localLoggedIn.memberId());
        });
    }
});
