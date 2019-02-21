import CreateMemberSample from '../../sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../../tpp/sample/RedeemTransferTokenSample';
import GetTransferSample from '../../sample/GetTransferSample';
import GetTransfersSample from '../../sample/GetTransfersSample';
import GetTransferTokensSample from '../../sample/GetTransferTokensSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('GetTransfersSample test', () => {
    let userMember, tppMember, tppAlias, redeemedTransfer;

    before(async () => {
        userMember = await CreateMemberSample();
        tppMember = await TestUtil.createTppMember();
        await LinkMemberAndBankSample(userMember);
        tppAlias = await tppMember.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(userMember, tppAlias);
        redeemedTransfer = await RedeemTransferTokenSample(tppMember, res.id);
    });

    it('GetTransfers', async () => {
        await TestUtil.waitUntil(async () => {
            const transfers = await GetTransfersSample(userMember);
            assert.equal(transfers.length, 1);
        });
    });

    it('GetTransfer', async () => {
        const fetchedTransfer = await GetTransferSample(userMember, redeemedTransfer.id);
        assert.equal(fetchedTransfer.payload.description, redeemedTransfer.payload.description);
    });

    it('GetTransferTokens', async () => {
        await TestUtil.waitUntil(async () => {
            const transferTokens = await GetTransferTokensSample(userMember);
            assert.equal(transferTokens.length, 1);
        });
    });
});
