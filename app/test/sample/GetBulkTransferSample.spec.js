import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseBulkTransferTokenSample
    from '../../sample/CreateAndEndorseBulkTransferTokenSample';
import RedeemBulkTransferTokenSample from '../../../tpp/sample/RedeemBulkTransferTokenSample';
import GetBulkTransferSample from '../../sample/GetBulkTransferSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetBulkTransferSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await CreateMemberSample();
        const tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        const tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseBulkTransferTokenSample(userMember, tppAlias);
        const bulkTransferToken = await RedeemBulkTransferTokenSample(tppMember, res.id);
        const bulkTransfer = await GetBulkTransferSample(userMember, bulkTransferToken);
        assert.exists(bulkTransfer.id, 'id is neither `null` nor `undefined`');
    });
});
