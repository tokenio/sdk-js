import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../sample/CreateAndEndorseAccessTokenSample';
import CancelAccessTokenBlockingSample from '../../sample/CancelAccessTokenBlockingSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelAccessTokenBlockingSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(userMember, tppAlias);
        const blockingCancelToken = await CancelAccessTokenBlockingSample(userMember, res.id);
        assert.doesNotThrow(blockingCancelToken, Error);
    });
});
