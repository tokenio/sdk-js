/* eslint-disable new-cap */
import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../src/sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../src/sample/RedeemTransferTokenSample';
import GetTransactionsSample from '../../src/sample/GetTransactionsSample';

describe('GetTransactionsSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Username = await member2.firstUsername();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Username);
        await RedeemTransferTokenSample(member2, res.id);
        await GetTransactionsSample(member);
    });
});
