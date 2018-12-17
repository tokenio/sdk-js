import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import RedeemAccessTokenSample from '../../src/sample/RedeemAccessTokenSample';
import {Resource} from '../../src';

const {assert} = require('chai');

describe('RedeemAccessTokenSample test', () => {
    it('Should run the \'use\' sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const balance = await RedeemAccessTokenSample.use(member2, res.id);

        assert.isAtLeast(parseFloat(balance.value), 1);
    });

    it('Should run the \'careful\' sample', async () => {
        const grantor = await CreateMemberSample();

        const auth1 = await grantor.createTestBankAccount(200, 'EUR');
        const auth2 = await grantor.createTestBankAccount(200, 'USD');
        const account1 = (await grantor.linkAccounts(auth1))[0];
        const account2 = (await grantor.linkAccounts(auth2))[0];

        const grantee = await CreateMemberSample();

        const granteeAlias = await grantee.firstAlias();
        const token1 = await CreateAndEndorseAccessTokenSample(grantor, granteeAlias);
        const balance1 = await RedeemAccessTokenSample.carefullyUse(grantee, token1.id);
        assert.isAtLeast(parseFloat(balance1.value), 1);

        const result = await grantor.replaceAccessToken(
            token1,
            [
                Resource.create({account: {accountId: account1.id}}),
                Resource.create({account: {accountId: account2.id}}),
                Resource.create({balance: {accountId: account1.id}}),
                Resource.create({balance: {accountId: account2.id}}),
            ]);
        await grantor.endorseToken(result.token);

        const balance2 = await RedeemAccessTokenSample.carefullyUse(grantee, token1.id);
        assert.isAtLeast(parseFloat(balance2.value), 1);

        await grantor.unlinkAccounts([account1.id, account2.id]);
        const balance3 = await RedeemAccessTokenSample.carefullyUse(grantee, token1.id);
        assert(!balance3.value);
    });
});
