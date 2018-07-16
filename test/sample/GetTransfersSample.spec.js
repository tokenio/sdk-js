/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../src/sample/CreateAndEndorseTransferTokenSample';
import RedeemTransferTokenSample from '../../src/sample/RedeemTransferTokenSample';
import GetTransferSample from '../../src/sample/GetTransferSample';
import GetTransfersSample from '../../src/sample/GetTransfersSample';
import GetTransferTokensSample from '../../src/sample/GetTransferTokensSample';
import TestUtil from '../TestUtil';

describe('GetTransfersSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        await RedeemTransferTokenSample(member2, res.id);
        await TestUtil.waitUntil(async () => {
            const transfers = await GetTransfersSample(member);
            assert.equal(transfers.length, 1);
        });
    });
});

describe('GetTransferSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        const redeemedTransfer = await RedeemTransferTokenSample(member2, res.id);
        const fetchedTransfer = await GetTransferSample(member, redeemedTransfer.id);
        assert.equal(fetchedTransfer.payload.description, redeemedTransfer.payload.description);
    });
});

describe('GetTransferTokensSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        await RedeemTransferTokenSample(member2, res.id);
        await TestUtil.waitUntil(async () => {
            const transferTokens = await GetTransferTokensSample(member);
            assert.equal(transferTokens.length, 1);
        });
    });
});
