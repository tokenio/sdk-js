import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemTransferTokenSample from '../../sample/RedeemTransferTokenSample';
import GetTransferSample from '../../sample/GetTransferSample';
import GetTransfersSample from '../../sample/GetTransfersSample';
import GetTransferTokensSample from '../../sample/GetTransferTokensSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetTransfersSample test', () => {
    let userMember, redeemedTransfer;

    before(async () => {
        userMember = await TestUtil.createUserMember();
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createTransferToken(userMember, tppAlias);
        redeemedTransfer = await RedeemTransferTokenSample(tppMember, res.id);
    });

    it('Should run the sample', async () => {
        await TestUtil.waitUntil(async () => {
            const transfers = await GetTransfersSample(userMember);
            assert.equal(transfers.length, 1);
        });
    });

    it('Should run the sample', async () => {
        const fetchedTransfer = await GetTransferSample(userMember, redeemedTransfer.id);
        assert.equal(fetchedTransfer.payload.description, redeemedTransfer.payload.description);
    });

    it('Should run the sample', async () => {
        await TestUtil.waitUntil(async () => {
            const transferTokens = await GetTransferTokensSample(userMember);
            assert.equal(transferTokens.length, 1);
        });
    });
});
