import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseStandingOrderTokenSample
    from '../../sample/CreateAndEndorseStandingOrderTokenSample';
import RedeemStandingOrderTokenSample from '../../../tpp/sample/RedeemStandingOrderTokenSample';
import GetStandingOrderSubmissionsSample from '../../sample/GetStandingOrderSubmissionsSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetStandingOrderSubmissionsSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseStandingOrderTokenSample(userMember, tppAlias);
        await RedeemStandingOrderTokenSample(tppMember, res.id);
        const standingOrderSubmissions = await GetStandingOrderSubmissionsSample(userMember, '', 10);
        assert.typeOf(standingOrderSubmissions, 'array', 'submissions is an array');
    });
});
