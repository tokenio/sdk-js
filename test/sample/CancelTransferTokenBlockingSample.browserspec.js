/* eslint-disable new-cap */
import TestUtil from '../TestUtil';

const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
  from '../../src/sample/CreateAndEndorseTransferTokenSample';
import CancelTransferTokenBlockingSample from '../../src/sample/CancelTransferTokenBlockingSample';

describe('CancelTransferTokenBlockingSample test', () => {
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
        const blockingCancelToken = await CancelTransferTokenBlockingSample(member, res.id);
        assert.doesNotThrow(blockingCancelToken, Error);
    });
});
