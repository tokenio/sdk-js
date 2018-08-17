import {TokenIO} from '../../src';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import ProvisionDeviceSample from '../../src/sample/ProvisionDeviceSample';
import TestUtil from '../TestUtil';

const {assert} = require('chai');

describe('ProvisionDeviceSample test', () => {
    if (!BROWSER) {
        it('ProvisionDeviceSample should run', async () => {
            const member = await CreateMemberSample();
            await TestUtil.waitUntil(async () => {
                assert.isOk(await member.firstAlias());
            });
            await member.subscribeToNotifications('iron');
            const alias = await member.firstAlias();

            const devKey = require('../../src/config.json').devKey[TEST_ENV];
            const Token = new TokenIO({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});
            const key = await ProvisionDeviceSample.provision(Token, alias);
            await member.approveKey(key);

            const localLoggedIn = await ProvisionDeviceSample.getMember(Token, alias);
            assert.equal(member.memberId(), localLoggedIn.memberId());
        });
    }
});
