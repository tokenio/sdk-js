import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import GetAccessTokensSample from '../../src/sample/GetAccessTokensSample';

const {assert} = require('chai');

describe('GetAccessTokensSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);

        const member2Alias = await member2.firstAlias();
        const createdToken = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const foundToken = await GetAccessTokensSample(member, member2.memberId());
        assert.equal(createdToken.id, foundToken.id);
    });
});
