import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../sample/CreateAndEndorseAccessTokenSample';
import GetAccessTokensSample from '../../sample/GetAccessTokensSample';
import ReplaceAccessTokenSample from '../../sample/ReplaceAccessTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('ReplaceAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        await CreateAndEndorseAccessTokenSample(userMember, tppAlias);
        const foundToken = await GetAccessTokensSample(userMember, tppMember.memberId());
        const newToken = await ReplaceAccessTokenSample(userMember, foundToken);
        assert.equal(
            JSON.stringify(newToken.payload.to.alias),
            JSON.stringify(tppAlias));
    });
});
