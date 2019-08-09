import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseStandingOrderTokenSample
    from '../../sample/CreateAndEndorseStandingOrderTokenSample';
import RedeemStandingOrderTokenSample from '../../../tpp/sample/RedeemStandingOrderTokenSample';
import GetStandingOrdersSample from '../../sample/GetStandingOrdersSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetStandingOrdersSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseStandingOrderTokenSample(userMember, tppAlias);
        await RedeemStandingOrderTokenSample(tppMember, res.id);
        const standingOrders = await GetStandingOrdersSample(userMember);
        assert.equal(standingOrders.length, 1);
    });
});

