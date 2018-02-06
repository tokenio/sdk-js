/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import MemberGetBalancesSample from '../../src/sample/MemberGetBalancesSample';

describe('MemberGetBalancesSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await LinkMemberAndBankSample(member);
        const sums = await MemberGetBalancesSample(member);

        assert.equal(sums.EUR, 200);
    });
});
