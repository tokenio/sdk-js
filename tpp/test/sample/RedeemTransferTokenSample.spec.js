import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemTransferTokenSample from '../../sample/RedeemTransferTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('RedeemTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const userMember = await TestUtil.createUserMember();
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        const transfer = await RedeemTransferTokenSample(tppMember, res.id);
        assert.isAtLeast(transfer.payloadSignatures.length, 1);
    });
});
