import CreateMemberSample from '../../sample/CreateMemberSample';
import CancelStandingOrderTokenSample from '../../sample/CancelStandingOrderTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelStandingOrderTokenSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const userMember = await TestUtil.createUserMember();
        const res = await TestUtil.createStandingOrderToken(userMember, tppAlias);
        const res2 = await CancelStandingOrderTokenSample(tppMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
