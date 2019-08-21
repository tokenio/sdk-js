import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemStandingOrderTokenSample from '../../sample/RedeemStandingOrderTokenSample';
import GetStandingOrdersSample from '../../sample/GetStandingOrdersSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetStandingOrdersSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createStandingOrderToken(userMember, tppAlias);
        await RedeemStandingOrderTokenSample(tppMember, res.id);
        const standingOrders = await GetStandingOrdersSample(userMember);
        assert.equal(standingOrders.length, 1);
    });
});
