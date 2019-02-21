import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../sample/CreateAndEndorseAccessTokenSample';
import GetAccessTokensSample from '../../sample/GetAccessTokensSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetAccessTokensSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const createdToken = await CreateAndEndorseAccessTokenSample(userMember, tppAlias);
        const foundToken = await GetAccessTokensSample(userMember, tppMember.memberId());
        assert.equal(createdToken.id, foundToken.id);
    });
});
