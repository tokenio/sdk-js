import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemBulkTransferTokenSample from '../../sample/RedeemBulkTransferTokenSample';
import TestUtil from '../TestUtil';
import GetBulkTransferSample from '../../sample/GetBulkTransferSample';
const {assert} = require('chai');

describe('GetBulkTransferSample test', () => {
    it('Should run the sample', async () => {
        const tppMember = await CreateMemberSample();
        const userMember = await TestUtil.createUserMember();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createBulkTransferToken(userMember, tppAlias);
        const bulkTransfer = await RedeemBulkTransferTokenSample(tppMember, res.id);
        const bulkTransferRecord = await GetBulkTransferSample(tppMember, bulkTransfer.id);
        assert.exists(bulkTransferRecord.tokenId, 'tokenId is neither `null` nor `undefined`');
    });
});
