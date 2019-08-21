import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemStandingOrderTokenSample from '../../sample/RedeemStandingOrderTokenSample';
import GetStandingOrderSample from '../../sample/GetStandingOrderSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetStandingOrderSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createStandingOrderToken(userMember, tppAlias);
        const standingOrderSubmission = await RedeemStandingOrderTokenSample(tppMember, res.id);
        const standingOrder = await GetStandingOrderSample(userMember, standingOrderSubmission);
        assert.exists(standingOrder.tokenId, 'tokenId is neither `null` nor `undefined`');
    });
});
