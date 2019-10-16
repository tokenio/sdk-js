import CreateMemberSample from '../../sample/CreateMemberSample';
import CancelBulkTransferTokenSample from '../../sample/CancelBulkTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelBulkTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const userMember = await TestUtil.createUserMember();
        const res = await TestUtil.createBulkTransferToken(userMember, tppAlias);
        const res2 = await CancelBulkTransferTokenSample(tppMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
