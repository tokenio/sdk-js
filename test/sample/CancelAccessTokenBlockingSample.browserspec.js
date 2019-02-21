import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import CancelAccessTokenBlockingSample from '../../src/sample/CancelAccessTokenBlockingSample';

const {assert} = require('chai');

describe('CancelAccessTokenBlockingSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const blockingCancelToken = await CancelAccessTokenBlockingSample(member, res.id);
        assert.doesNotThrow(blockingCancelToken, Error);
    });
});
