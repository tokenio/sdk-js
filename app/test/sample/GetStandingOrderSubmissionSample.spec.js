import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseStandingOrderTokenSample
    from '../../sample/CreateAndEndorseStandingOrderTokenSample';
import RedeemStandingOrderTokenSample from '../../../tpp/sample/RedeemStandingOrderTokenSample';
import GetStandingOrderSubmissionSample from '../../sample/GetStandingOrderSubmissionSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetStandingOrderSubmissionSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseStandingOrderTokenSample(userMember, tppAlias);
        const standingOrderToken = await RedeemStandingOrderTokenSample(tppMember, res.id);
        const standingOrderSubmission = await GetStandingOrderSubmissionSample(userMember, standingOrderToken);
        assert.operator(parseInt(standingOrderSubmission.payload.amount), '>', 0);
    });
});
