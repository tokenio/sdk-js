import {TokenClient} from '../../src';
import CreateMemberSample from '../../sample/CreateMemberSample';
import ProvisionDeviceSample from '../../sample/ProvisionDeviceSample';
const {assert} = require('chai');

describe('ProvisionDeviceSample test', () => {
    it('ProvisionDeviceSample should run', async () => {
        const member = await CreateMemberSample();
        await member.subscribeToNotifications('iron');
        const alias = await member.firstAlias();

        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});
        const key = await ProvisionDeviceSample.provision(Token, alias);
        await member.approveKey(key);

        const localLoggedIn = await ProvisionDeviceSample.getMember(Token, alias);
        assert.equal(member.memberId(), localLoggedIn.memberId());
    });
});
