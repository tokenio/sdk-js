import CreateMemberSample from '../../sample/CreateMemberSample';
import CancelAccessTokenSample from '../../sample/CancelAccessTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const userMember = await TestUtil.createUserMember();
        const res = await TestUtil.createAccessToken(userMember, tppAlias);
        const res2 = await CancelAccessTokenSample(tppMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
