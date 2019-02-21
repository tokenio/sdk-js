import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../sample/CreateAndEndorseAccessTokenSample';
import CancelAccessTokenSample from '../../sample/CancelAccessTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(userMember, tppAlias);
        const res2 = await CancelAccessTokenSample(userMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
