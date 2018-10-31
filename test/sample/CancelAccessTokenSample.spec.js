import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import CancelAccessTokenSample from '../../src/sample/CancelAccessTokenSample';
import {TokenOperationStatus} from '../../src';

const {assert} = require('chai');

describe('CancelAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const res2 = await CancelAccessTokenSample(member, res.id);
        assert.equal(res2.status, TokenOperationStatus.SUCCESS);
    });
});
