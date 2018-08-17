import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import TestUtil from '../TestUtil';

const {assert} = require('chai');

describe('CreateAndEndorseAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});
