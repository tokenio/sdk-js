import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../sample/CreateAndEndorseAccessTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CreateAndEndorseAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(userMember, tppAlias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});
