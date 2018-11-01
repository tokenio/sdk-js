import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample from '../../src/sample/CreateAndEndorseTransferTokenSample';
import CancelTransferTokenSample from '../../src/sample/CancelTransferTokenSample';
import {TokenOperationStatus} from '../../src';

const {assert} = require('chai');

describe('CancelTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        const res2 = await CancelTransferTokenSample(member, res.id);
        assert.equal(res2.status, TokenOperationStatus.SUCCESS);
    });
});
