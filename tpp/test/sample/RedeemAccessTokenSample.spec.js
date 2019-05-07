import CreateMemberSample from '../../sample/CreateMemberSample';
import RedeemAccessTokenSample from '../../sample/RedeemAccessTokenSample';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('RedeemAccessTokenSample test', () => {
    it('Simple', async () => {
        const userMember = await TestUtil.createUserMember();
        const tppMember = await CreateMemberSample();
        const tppAlias = await tppMember.firstAlias();
        const res = await TestUtil.createAccessToken(userMember, tppAlias);
        const balance = await RedeemAccessTokenSample.use(tppMember, res.id);
        assert.isAtLeast(parseFloat(balance.value), 1);
    });

    it('Complex', async () => {
        const grantor = await TestUtil.createUserMember();
        const grantee = await CreateMemberSample();
        const granteeAlias = await grantee.firstAlias();
        const token1 = await TestUtil.createAccessToken(grantor, granteeAlias);
        const balance1 = await RedeemAccessTokenSample.use(grantee, token1.id);
        assert.isAtLeast(parseFloat(balance1.value), 1);

        const account2 = await grantor.createAndLinkTestBankAccount(200, 'EUR');
        const result = await grantor.replaceAccessToken(
            token1,
            [
                {account: {accountId: account2.id()}},
                {balance: {accountId: account2.id()}},
            ]);
        await grantor.endorseToken(result.token);

        const balance2 = await RedeemAccessTokenSample.use(grantee, token1.id);
        assert.isAtLeast(parseFloat(balance2.value), 1);

        await grantor.unlinkAccounts([account2.id()]);
        const accounts = await grantee.getAccounts();
        assert.isEmpty(accounts);
    });
});
