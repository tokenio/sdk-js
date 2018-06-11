/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import RedeemAccessTokenSample from '../../src/sample/RedeemAccessTokenSample';
import TestUtil from '../TestUtil';

describe('RedeemAccessTokenSample test', () => {
    it('Should run the "use" sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const balance = await RedeemAccessTokenSample.use(member2, res.id);

        assert.isAtLeast(parseFloat(balance.value), 1);
    });

    it('Should run the "careful" sample', async () => {
        const grantor = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await grantor.firstAlias());
        });
        const auth1 = await grantor.createTestBankAccount(200, 'EUR');
        const auth2 = await grantor.createTestBankAccount(200, 'USD');
        const account1 = (await grantor.linkAccounts(auth1))[0];
        const account2 = (await grantor.linkAccounts(auth2))[0];

        const grantee = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await grantee.firstAlias());
        });

        const granteeAlias = await grantee.firstAlias();
        const token1 = await CreateAndEndorseAccessTokenSample(grantor, granteeAlias);
        const balance1 = await RedeemAccessTokenSample.carefullyUse(grantee, token1.id);
        assert.isAtLeast(parseFloat(balance1.value), 1);

        await grantor.replaceAndEndorseAccessToken(
            token1,
            [{account: {accountId: account1.id}},
             {account: {accountId: account2.id}},
             {balance: {accountId: account1.id}},
             {balance: {accountId: account2.id}}]);

        const balance2 = await RedeemAccessTokenSample.carefullyUse(grantee, token1.id);
        assert.isAtLeast(parseFloat(balance2.value), 1);

        await grantor.unlinkAccounts([account1.id, account2.id]);
        const balance3 = await RedeemAccessTokenSample.carefullyUse(grantee, token1.id);
        assert(!balance3.value);
    });
});
