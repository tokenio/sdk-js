/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

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

        const member2Alias = {type: 'USERNAME', value: await member2.firstAlias()};
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        await RedeemTransferTokenSample(member2, res.id);
        const transactions = await GetTransactionsSample(member);
        assert.equal(transactions.length, 1);
    });
});
