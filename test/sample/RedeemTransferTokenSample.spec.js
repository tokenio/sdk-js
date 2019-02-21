import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../src/sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../src/sample/RedeemTransferTokenSample';

const {assert} = require('chai');

describe('RedeemTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        const transfer = await RedeemTransferTokenSample(member2, res.id);
        assert.isAtLeast(transfer.payloadSignatures.length, 1);
    });
});
