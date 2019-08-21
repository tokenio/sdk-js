import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseStandingOrderTokenSample
    from '../../sample/CreateAndEndorseStandingOrderTokenSample';
import CancelStandingOrderTokenSample from '../../sample/CancelStandingOrderTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelStandingOrderTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseStandingOrderTokenSample(userMember, tppAlias);
        const res2 = await CancelStandingOrderTokenSample(userMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
