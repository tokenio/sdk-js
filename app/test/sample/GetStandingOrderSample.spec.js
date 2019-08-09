import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseStandingOrderTokenSample
    from '../../sample/CreateAndEndorseStandingOrderTokenSample';
import RedeemStandingOrderTokenSample from '../../../tpp/sample/RedeemStandingOrderTokenSample';
import GetStandingOrderSample from '../../sample/GetStandingOrderSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetStandingOrderSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseStandingOrderTokenSample(userMember, tppAlias);
        const standingOrderToken = await RedeemStandingOrderTokenSample(tppMember, res.id);
        const standingOrder = await GetStandingOrderSample(userMember, standingOrderToken);
        assert.exists(standingOrder.id, 'standingOrder.id is neither `null` nor `undefined`');
    });
});
