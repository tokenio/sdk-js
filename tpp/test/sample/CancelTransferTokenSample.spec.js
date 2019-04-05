import CreateMemberSample from '../../sample/CreateMemberSample';
import CancelTransferTokenSample from '../../sample/CancelTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const userMember = await TestUtil.createUserMember();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        const res2 = await CancelTransferTokenSample(tppMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
