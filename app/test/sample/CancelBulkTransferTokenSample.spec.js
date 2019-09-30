import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseBulkTransferTokenSample
    from '../../sample/CreateAndEndorseBulkTransferTokenSample';
import CancelBulkTransferTokenSample from '../../sample/CancelBulkTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('CancelBulkTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseBulkTransferTokenSample(userMember, tppAlias);
        const res2 = await CancelBulkTransferTokenSample(userMember, res.id);
        assert.equal(res2.status, 'SUCCESS');
    });
});
