/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../src/sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../src/sample/RedeemTransferTokenSample';
import GetTransactionSample from '../../src/sample/GetTransactionSample';

describe('GetTransactionSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Username = await member2.firstUsername();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Username);
        const transfer = await RedeemTransferTokenSample(member2, res.id);
        const transaction = await GetTransactionSample(member, transfer);
        assert.equal(transaction.amount.value, 5);
    });
});
