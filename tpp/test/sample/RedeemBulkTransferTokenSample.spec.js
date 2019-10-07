import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemBulkTransferTokenSample from '../../sample/RedeemBulkTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('RedeemBulkTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await TestUtil.createUserMember();
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createBulkTransferToken(userMember, tppAlias);
        const bulkTransfer = await RedeemBulkTransferTokenSample(tppMember, res.id);
        assert.exists(bulkTransfer.tokenId, 'tokenId is neither `null` nor `undefined`');
    });
});
