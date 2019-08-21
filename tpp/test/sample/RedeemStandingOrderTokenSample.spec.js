import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemStandingOrderTokenSample from '../../sample/RedeemStandingOrderTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('RedeemStandingOrderTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await TestUtil.createUserMember();
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createStandingOrderToken(userMember, tppAlias);
        const standingOrderSubmission = await RedeemStandingOrderTokenSample(tppMember, res.id);
        assert.exists(standingOrderSubmission.tokenId, 'tokenId is neither `null` nor `undefined`');
    });
});
